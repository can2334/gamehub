// services/api.ts

const BASE_URL = "https://gamebackend.cansalman332.workers.dev/api";

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
}

export const gameApi = {
    generateCode: async () => {
        const res = await fetch(`${BASE_URL}/generate-code`);
        return (await res.json()) as { code: string };
    },

    startSession: async (groupCode: string, category: string) => {
        return fetch(`${BASE_URL}/session/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupCode, category }),
        });
    },

    joinSession: async (groupCode: string, teamName: string) => {
        return fetch(`${BASE_URL}/session/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupCode, teamName }),
        });
    },

    getSessionStatus: async (code: string): Promise<GameStatusResponse> => {
        const res = await fetch(`${BASE_URL}/session/status?code=${code}`);
        if (!res.ok) throw new Error("Oda Bulunamadı");
        const data = await res.json();

        const teams = (data.teams || []).map((t: any) => ({
            teamName: t.teamName,
            selectedAnswer: t.selectedAnswer || null,
            isCorrect: Number(t.isCorrect) || 0,
            score: Number(t.score) || 0
        }));

        if (data.currentQuestion && typeof data.currentQuestion.options === 'string') {
            try {
                data.currentQuestion.options = JSON.parse(data.currentQuestion.options);
            } catch (e) {
                console.error("Options parse error");
            }
        }

        return {
            teams,
            currentQuestion: data.currentQuestion,
            currentQuestionIndex: data.currentQuestionIndex,
            status: data.status
        };
    },
    deleteQuestion: async (id: number) => {
        const res = await fetch(`${BASE_URL}/questions`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Soru silinemedi");
        return res.json();
    },
    resetAnswers: async (code: string) => {
        return fetch(`${BASE_URL}/session/reset?code=${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    },

    finishSession: async (groupCode: string) => {
        return fetch(`${BASE_URL}/session/finish?code=${groupCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // 1. BU MEVCUT FONKSİYON: Sadece şıkkı günceller (Admin panelinde görmek için)
    // Öğrenci her tıkladığında bu çalışsın ama sunucu tarafında puan eklemesin 
    // (Sunucu kodunda isCorrect true ise her seferinde puan veriyorsa, isCorrect'i 0 göndeririz)
    submitAnswer: async (groupCode: string, teamName: string, answer: string) => {
        const res = await fetch(`${BASE_URL}/session/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupCode, teamName, answer, isCorrect: false }), // Puan vermez, sadece şıkkı gösterir
        });
        return res.json();
    },

    // 2. YENİ FONKSİYON: Sadece süre bittiğinde çalışır ve puanı verir
    submitFinalScore: async (groupCode: string, teamName: string, answer: string, isCorrect: boolean) => {
        const res = await fetch(`${BASE_URL}/session/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupCode, teamName, answer, isCorrect }), // Gerçek sonucu ve puanı gönderir
        });
        return res.json();
    }
};