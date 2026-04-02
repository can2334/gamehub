const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const app = express();
const PORT = 3001;

// DB
const db = new Database("veriler.db", { verbose: console.log });
// Middleware
app.use(cors());
app.use(express.json());

// CORS Headers (Worker tarzı)
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, PATCH, DELETE, PUT",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Express 5 uyumlu hali
app.options("/*", (req, res) => {
    res.set(corsHeaders);
    res.sendStatus(204); // send() yerine 204 No Content daha doğrudur
});

// Tüm response'lara CORS header ekle
app.use((req, res, next) => {
    Object.entries(corsHeaders).forEach(([key, val]) => {
        res.set(key, val);
    });
    next();
});

// ==================== CHARSET & CODE GENERATOR ====================
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateGroupCode() {
    const part = () =>
        Array.from({ length: 4 }, () =>
            CHARSET[Math.floor(Math.random() * CHARSET.length)]
        ).join("");
    return `${part()}-${part()}`;
}

// ==================== AUTH ====================
app.post("/api/auth", (req, res) => {
    try {
        const { user, pass } = req.body;
        const check = db
            .prepare("SELECT role FROM users WHERE username=? AND password=?")
            .get(user, pass);

        if (!check) {
            return res.status(401).json({ success: false, message: "Hatalı Giriş" });
        }
        res.json({ success: true, role: check.role });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== CATEGORIES ====================
app.get("/api/categories", (req, res) => {
    try {
        const rows = db.prepare(`
      SELECT name as id, REPLACE(name,'tabu_','') as name
      FROM sqlite_master
      WHERE type='table' AND name LIKE 'tabu_%'
    `).all();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== GAMES ====================
app.get("/api/games", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM games").all();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/games", (req, res) => {
    try {
        const { title, category, slug } = req.body;
        db.prepare(
            "INSERT INTO games (title,category,slug,isActive) VALUES (?,?,?,1)"
        ).run(title, category, slug);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put("/api/games", (req, res) => {
    try {
        const { id, isActive, title, category } = req.body;
        db.prepare(
            "UPDATE games SET isActive=?, title=?, category=? WHERE id=?"
        ).run(isActive ? 1 : 0, title, category, id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete("/api/games", (req, res) => {
    try {
        db.prepare("DELETE FROM games WHERE id=?").run(req.query.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== QUESTIONS ====================
app.get("/api/questions", (req, res) => {
    try {
        const cat = (req.query.category || req.query.lesson || "bilisim").toLowerCase();
        const table = cat.startsWith("tabu")
            ? cat
            : `questions_${cat.replace(/[^a-z0-9_]/gi, "")}`;

        const rows = db.prepare(`SELECT * FROM ${table}`).all();
        const formatted = rows.map(q => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
            forbidden_words: typeof q.forbidden_words === "string"
                ? JSON.parse(q.forbidden_words)
                : q.forbidden_words
        }));
        res.json(formatted);
    } catch (e) {
        res.status(404).json({ error: "Tablo bulunamadı: " + e.message });
    }
});

app.post("/api/questions", (req, res) => {
    try {
        const q = req.body;
        const cat = (req.query.category || "bilisim").toLowerCase();
        const table = cat.startsWith("tabu") ? cat : `questions_${cat}`;
        const isTabu = table.startsWith("tabu");

        if (q.id) {
            const sql = isTabu
                ? `UPDATE ${table} SET word=?, forbidden_words=?, isExtra=? WHERE id=?`
                : `UPDATE ${table} SET question=?, options=?, correctAnswer=?, level=? WHERE id=?`;

            const params = isTabu
                ? [q.word, JSON.stringify(q.forbidden_words), q.isExtra ? 1 : 0, q.id]
                : [q.question, JSON.stringify(q.options), q.correctAnswer, q.level, q.id];

            db.prepare(sql).run(...params);
        } else {
            const sql = isTabu
                ? `INSERT INTO ${table} (word,forbidden_words,isExtra) VALUES (?,?,?)`
                : `INSERT INTO ${table} (question,options,correctAnswer,level) VALUES (?,?,?,?)`;

            const params = isTabu
                ? [q.word, JSON.stringify(q.forbidden_words), q.isExtra ? 1 : 0]
                : [q.question, JSON.stringify(q.options), q.correctAnswer, q.level];

            db.prepare(sql).run(...params);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete("/api/questions", (req, res) => {
    try {
        const cat = (req.query.category || "bilisim").toLowerCase();
        const table = cat.startsWith("tabu") ? cat : `questions_${cat}`;
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "ID gerekli" });
        db.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
        res.json({ success: true, message: "Soru silindi" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== MULTIGAME ====================
app.get("/api/multigame", (req, res) => {
    try {
        const rows = req.query.category
            ? db.prepare("SELECT * FROM multigame WHERE ders=?").all(req.query.category)
            : db.prepare("SELECT * FROM multigame").all();

        const formatted = rows.map(q => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/multigame", (req, res) => {
    try {
        const q = req.body;
        const optionsStr = typeof q.options === "object" ? JSON.stringify(q.options) : (q.options || "{}");
        db.prepare(
            "INSERT INTO multigame (ders,question,options,correctAnswer,sure) VALUES (?,?,?,?,?)"
        ).run(
            q.ders || "multigame",
            q.question,
            optionsStr,
            q.correctAnswer,
            q.sure || 30
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete("/api/multigame", (req, res) => {
    try {
        db.prepare("DELETE FROM multigame").run();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== SESSION ====================
app.get("/api/generate-code", (req, res) => {
    res.json({ code: generateGroupCode() });
});

app.post("/api/session/start", (req, res) => {
    try {
        const { groupCode, category } = req.body;
        db.prepare(`
      INSERT OR REPLACE INTO sessions (groupCode,category,status,currentQuestionIndex)
      VALUES (?,?, 'waiting', 0)
    `).run(groupCode, category);
        db.prepare("DELETE FROM team_answers WHERE groupCode=?").run(groupCode);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/join", (req, res) => {
    try {
        const { groupCode, teamName } = req.body;
        const session = db
            .prepare("SELECT * FROM sessions WHERE groupCode=?")
            .get(groupCode);

        if (!session) return res.status(404).json({ error: "Kod bulunamadı" });

        if (teamName) {
            db.prepare(`
        INSERT INTO team_answers (groupCode,teamName,score,isCorrect)
        VALUES (?,?,0,0)
        ON CONFLICT(groupCode,teamName) DO NOTHING
      `).run(groupCode, teamName);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/leave", (req, res) => {
    try {
        const { groupCode, teamName } = req.body;
        db.prepare(
            "DELETE FROM team_answers WHERE groupCode=? AND teamName=?"
        ).run(groupCode.toUpperCase(), teamName);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/reset", (req, res) => {
    try {
        const code = req.query.code;
        db.prepare(
            "UPDATE sessions SET currentQuestionIndex = currentQuestionIndex + 1 WHERE groupCode=?"
        ).run(code);
        db.prepare(
            "UPDATE team_answers SET selectedAnswer = NULL, isCorrect = 0 WHERE groupCode=?"
        ).run(code);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/answer", (req, res) => {
    try {
        const { groupCode, teamName, answer } = req.body;

        const existing = db
            .prepare("SELECT selectedAnswer FROM team_answers WHERE groupCode=? AND teamName=?")
            .get(groupCode.toUpperCase(), teamName);

        if (existing && existing.selectedAnswer) {
            return res.status(400).json({ success: false, message: "Zaten cevap verdiniz" });
        }

        db.prepare(`
      UPDATE team_answers 
      SET selectedAnswer = ?, score = score + 10 
      WHERE groupCode = ? AND teamName = ?
    `).run(answer, groupCode.toUpperCase(), teamName);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/submit-final", (req, res) => {
    try {
        const { groupCode, teamName, answer, questionId } = req.body;

        const session = db
            .prepare("SELECT * FROM sessions WHERE groupCode = ?")
            .get(groupCode);

        if (!session) return res.status(404).json({ error: "Session yok" });

        const cat = session.category.toLowerCase();
        let question;

        if (cat === "multigame") {
            question = db.prepare("SELECT * FROM multigame WHERE id = ?").get(questionId);
        } else {
            const tableName = cat.startsWith("tabu")
                ? cat
                : `questions_${cat.replace(/[^a-z0-9_]/gi, '')}`;
            question = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(questionId);
        }

        if (!question) return res.status(404).json({ error: "Soru bulunamadı" });

        const correct =
            String(question.correctAnswer).trim().toUpperCase() ===
            String(answer).trim().toUpperCase();

        const existing = db.prepare(`
      SELECT isCorrect FROM team_answers
      WHERE groupCode = ? AND teamName = ?
    `).get(groupCode, teamName);

        if (existing && existing.isCorrect === 1) {
            return res.json({ success: true, ignored: true });
        }

        db.prepare(`
      UPDATE team_answers
      SET selectedAnswer = ?, isCorrect = ?, score = score + ?
      WHERE groupCode = ? AND teamName = ?
    `).run(answer, correct ? 1 : 0, correct ? 10 : 0, groupCode, teamName);

        res.json({ success: true, correct });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/add-scores", (req, res) => {
    try {
        const { groupCode, teams, points } = req.body;
        for (const teamName of teams) {
            db.prepare(
                "UPDATE team_answers SET score = score + ? WHERE groupCode = ? AND teamName = ?"
            ).run(points, groupCode, teamName);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/api/session/status", (req, res) => {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).json({ error: "Kod gerekli" });

        const session = db.prepare("SELECT * FROM sessions WHERE groupCode=?").get(code);
        if (!session) return res.status(404).json({ error: "Oda bulunamadı" });

        const teams = db.prepare("SELECT * FROM team_answers WHERE groupCode=?").all(code);

        const cat = session.category.toLowerCase();
        const table = cat === "multigame"
            ? "multigame"
            : cat.startsWith("tabu")
                ? cat
                : `questions_${cat}`;

        const questions = db.prepare(`SELECT * FROM ${table} ORDER BY id ASC`).all();
        const q = questions[session.currentQuestionIndex];

        let formattedQuestion = null;
        if (q) {
            let options = q.options;
            if (typeof options === "string") {
                try { options = JSON.parse(options); } catch (e) { options = null; }
            }
            formattedQuestion = {
                ...q,
                options,
                correctAnswer: String(q.correctAnswer || "").trim().toUpperCase()
            };
        }

        res.json({
            teams,
            status: session.status,
            currentQuestion: formattedQuestion,
            currentQuestionIndex: session.currentQuestionIndex
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/update-status", (req, res) => {
    try {
        const { code, status } = req.body;
        const result = db.prepare("UPDATE sessions SET status=? WHERE groupCode=?").run(status, code);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Oda bulunamadı" });
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/session/finish", (req, res) => {
    try {
        let groupCode = req.query.code || req.query.groupCode || req.body.groupCode || req.body.code;
        if (!groupCode) return res.status(400).json({ error: "Grup kodu bulunamadı!" });
        db.prepare("UPDATE sessions SET status='finished' WHERE groupCode=?").run(groupCode);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () =>
    console.log(`🚀 Server hazır → http://localhost:${PORT}`)
);