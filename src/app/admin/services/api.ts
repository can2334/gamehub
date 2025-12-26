// services/api.ts

const BASE_URL = "https://gamebackend.cansalman332.workers.dev";

export interface TeamStatus {
    teamName: string;
    selectedAnswer: string | null;
    isCorrect: number;
    score: number;
}

export interface Question {
    id?: number;
    question: string;
    options: any;
    correctAnswer: string;
    word?: string;
    sure?: number;
}

export interface GameStatusResponse {
    teams: TeamStatus[];
    currentQuestion?: Question | null;
    currentQuestionIndex?: number;
    status?: string;
    ders?: string;
}

export const gameApi = {

    // 1. Kod Oluşturma
    generateCode: async () => {
        const res = await fetch(`${BASE_URL}/api/generate-code`);
        if (!res.ok) throw new Error("Kod alınamadı");
        return (await res.json()) as { code: string };
    },

    // 2. Oturum Başlatma
    startSession: async (groupCode: string, category: string) => {
        const res = await fetch(`${BASE_URL}/api/session/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                groupCode,
                category,
                status: "waiting"
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err?.detay || "Session başlatılamadı");
        }
        return res.json();
    },

    // 3. Oturuma Katılma
    joinSession: async (groupCode: string, teamName: string) => {
        const res = await fetch(`${BASE_URL}/api/session/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupCode, teamName })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err?.detay || "Odaya katılım başarısız");
        }
        return res.json();
    },

    // 4. Oda Durumunu Alma (Polling)
    getSessionStatus: async (code: string): Promise<GameStatusResponse> => {
        const res = await fetch(`${BASE_URL}/api/session/status?code=${code}`);
        if (!res.ok) throw new Error("Oda bulunamadı");

        const data = await res.json();

        const teams = (data.teams || []).map((t: any) => ({
            teamName: t.teamName,
            selectedAnswer: t.selectedAnswer ?? null,
            isCorrect: Number(t.isCorrect ?? 0),
            score: Number(t.score ?? 0)
        }));

        if (data.currentQuestion?.options && typeof data.currentQuestion.options === "string") {
            try {
                data.currentQuestion.options = JSON.parse(data.currentQuestion.options);
            } catch {
                console.error("Options parse edilemedi");
            }
        }

        return {
            teams,
            currentQuestion: data.currentQuestion ?? null,
            currentQuestionIndex: data.currentQuestionIndex ?? 0,
            status: data.status ?? "waiting"
        };
    },

    // 5. Durum Güncelleme
    updateStatus: async (code: string, status: "waiting" | "active" | "finished") => {
        const res = await fetch(`${BASE_URL}/api/session/update-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: code,
                status: status
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Status güncellenemedi");
        }
        return res.json();
    },

    // 6. PUAN EKLEME (Yeni Eklenen Metod)
    // Admin panelinde takımlara puan eklemek için kullanılır
    updateScore: async (groupCode: string, teamName: string, points: number) => {
        const res = await fetch(`${BASE_URL}/api/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                groupCode: groupCode,
                teamName: teamName,
                points: points
            })
        });

        if (!res.ok) throw new Error("Puan eklenemedi");
        return res.json();
    },

    // 7. Soru Cevabı Gönderme (Öğrenci Tarafı)
    submitAnswer: async (groupCode: string, teamName: string, answer: string) => {
        const res = await fetch(`${BASE_URL}/api/session/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                groupCode,
                teamName,
                answer,
                isCorrect: false // Sadece seçimi iletir, puanı admin tarafı tetikler
            })
        });

        if (!res.ok) throw new Error("Cevap gönderilemedi");
        return res.json();
    },

    // 8. Cevapları Sıfırlama
    resetAnswers: async (code: string) => {
        const res = await fetch(`${BASE_URL}/api/session/reset?code=${code}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Cevaplar sıfırlanamadı");
        return res.json();
    },

    // 9. Yarışmayı Bitirme
    finishSession: async (groupCode: string) => {
        const res = await fetch(`${BASE_URL}/api/session/finish?code=${groupCode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Yarışma bitirilemedi");
        return res.json();
    },

    // 10. Soru Silme (Genel Havuz)
    deleteQuestion: async (id: number) => {
        const res = await fetch(`${BASE_URL}/api/questions`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error("Soru silinemedi");
        return res.json();
    },
    // 11. 
    submitFinalAnswer: (payload: {
        groupCode: string;
        teamName: string;
        answer: string;
        questionId: number;
    }) =>
        fetch(`${BASE_URL}/api/session/submit-final`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then(res => res.json()),

};