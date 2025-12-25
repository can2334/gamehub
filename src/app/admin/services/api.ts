// BASE_URL sonundaki /api kalsın
const BASE_URL = "https://gamebackend.cansalman332.workers.dev/api";

export interface TeamStatus {
    teamName: string;
    selectedAnswer: string | null;
    isCorrect: number;
    score: number;
}

export interface Question {
    id: number;
    question: string;
    // DÜZELTME: options hem obje hem string (JSON metni) olabilir dedik
    options: any;
    correctAnswer: string;
    level?: string;
    word?: string;
}

export interface GameStatusResponse {
    teams: TeamStatus[];
    currentQuestion?: Question | null;
    currentQuestionIndex?: number;
    status?: string;
}

export const gameApi = {
    // 1. KOD ÜRETME
    generateCode: async () => {
        const res = await fetch(`${BASE_URL}/generate-code`);
        return (await res.json()) as { code: string };
    },

    // 2. OTURUM BAŞLATMA
    startSession: async (groupCode: string, category: string) => {
        return fetch(`${BASE_URL}/session/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupCode, category }),
        });
    },

    // api.ts dosyasındaki getSessionStatus kısmını bununla değiştir
    getSessionStatus: async (code: string): Promise<GameStatusResponse> => {
        const res = await fetch(`${BASE_URL}/session/status?code=${code}`);
        if (!res.ok) throw new Error("Oda Bulunamadı");

        const data = await res.json();

        // EĞER ŞIKLAR STRING OLARAK GELİRSE OBJE YAP (BÜYÜK İHTİMALLE SORUN BURADA)
        if (data.currentQuestion && typeof data.currentQuestion.options === 'string') {
            try {
                data.currentQuestion.options = JSON.parse(data.currentQuestion.options);
            } catch (e) {
                console.error("Şıklar çözülemedi:", e);
            }
        }
        return data;
    },
    // 4. CEVAPLARI SIFIRLAMA
    resetAnswers: async (code: string) => {
        return fetch(`${BASE_URL}/session/reset?code=${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // 5. OYUNU BİTİRME
    finishSession: async (groupCode: string) => {
        return fetch(`${BASE_URL}/session/finish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupCode }),
        });
    },

    // 6. ODAYA KATILMA
    joinSession: async (groupCode: string, teamName: string) => {
        return fetch(`${BASE_URL}/session/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupCode, teamName }),
        });
    },

    // 7. CEVAP GÖNDERME
    async submitAnswer(groupCode: string, teamName: string, answer: string, isCorrect: boolean) {
        const res = await fetch(`${BASE_URL}/session/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupCode, teamName, answer, isCorrect }),
        });
        if (!res.ok) throw new Error("Cevap iletilemedi");
        return res.json();
    },
};