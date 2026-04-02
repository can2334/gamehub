"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Github,
    Code2,
    Globe,
    Database,
    ChevronRight,
    CheckCircle2,
    Clock,
    Zap,
    ArrowRight,
    BookOpen,
    Terminal,
    Copy,
    Check,
    ChevronDown,
    ImageIcon,
    AlertCircle,
    Info,
} from "lucide-react";

// ─── Tip Tanımları ───────────────────────────────────────────
type AdimIcerik =
    | { tip: "metin"; icerik: string }
    | { tip: "kod"; dil: string; icerik: string }
    | { tip: "foto"; src: string; alt: string; aciklama?: string }
    | { tip: "uyari"; icerik: string }
    | { tip: "bilgi"; icerik: string };

interface Adim {
    no: number;
    baslik: string;
    icerikler: AdimIcerik[];
}

interface Bolum {
    no: string;
    id: string;
    icon: React.ElementType;
    renk: string;
    baslik: string;
    sure: string;
    ozet: string;
    adimlar: Adim[];
}

// ─── İçerik Verisi ───────────────────────────────────────────
const bolumler: Bolum[] = [
    {
        no: "01",
        id: "github",
        icon: Github,
        renk: "emerald",
        baslik: "GitHub",
        sure: "~45 dk",
        ozet: "Versiyon kontrolünü öğren, ilk repounu oluştur ve terminalden GitHub'a bağlan.",
        adimlar: [
            {
                no: 1,
                baslik: "GitHub'a Kayıt Ol",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "github.com adresine git ve sağ üstteki 'Sign up' butonuna bas. E-posta, kullanıcı adı ve şifre girerek hesabını oluştur. Öğrenci iseniz GitHub Education üzerinden Pro hesap alabilirsin — ücretsiz!",
                    },
                    {
                        tip: "foto",
                        src: "/egitim/github-signup.png",
                        alt: "GitHub kayıt ekranı",
                        aciklama: "github.com ana sayfasında 'Sign up' butonu sağ üstte yer alır.",
                    },
                    {
                        tip: "bilgi",
                        icerik:
                            "Kullanıcı adın kalıcı ve profesyonel olsun — bu adres portfolio'n olacak. ad.soyad veya adsoyadXX gibi bir format iyi çalışır.",
                    },
                ],
            },
            {
                no: 2,
                baslik: "İlk Repo'yu Oluştur",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "Giriş yaptıktan sonra sağ üstteki '+' ikonuna tıkla → 'New repository' seç. Repo adını yaz (örn: ilk-proje), 'Public' seç ve 'Add a README file' kutucuğunu işaretle. 'Create repository' butonuna bas.",
                    },
                    {
                        tip: "foto",
                        src: "/egitim/github-new-repo.png",
                        alt: "Yeni repo oluşturma ekranı",
                        aciklama: "Repository name boş bırakılmamalı, boşluk yerine tire (-) kullan.",
                    },
                    {
                        tip: "bilgi",
                        icerik:
                            "README.md dosyası projenin tanıtım sayfasıdır. Her projeye eklemeyi alışkanlık haline getir.",
                    },
                ],
            },
            {
                no: 3,
                baslik: "Git Kur ve Terminale Bağla",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "git-scm.com adresinden Git'i bilgisayarına kur. Kurulumdan sonra terminali aç (Windows'ta PowerShell veya Git Bash) ve kimliğini tanıt:",
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# Kimliğini tanıt (bir kez yapılır)
git config --global user.name "Adın Soyadın"
git config --global user.email "email@example.com"

# Doğru kuruldu mu kontrol et
git --version`,
                    },
                    {
                        tip: "foto",
                        src: "/egitim/git-version.png",
                        alt: "git --version çıktısı",
                        aciklama: "Terminalde bu çıktıyı görüyorsan Git başarıyla kurulmuş demektir.",
                    },
                ],
            },
            {
                no: 4,
                baslik: "İlk Commit ve Push",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "Bilgisayarında bir klasör oluştur, içine dosya ekle ve GitHub'a gönder. Aşağıdaki komutları sırasıyla çalıştır:",
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# 1. Klasör oluştur ve gir
mkdir ilk-proje
cd ilk-proje

# 2. Git başlat
git init

# 3. GitHub repoyla bağla (kendi repo URL'ini yaz)
git remote add origin https://github.com/KULLANICI_ADIN/ilk-proje.git

# 4. Bir dosya oluştur
echo "# Merhaba!" > README.md

# 5. Dosyayı sahneye al
git add .

# 6. Commit oluştur
git commit -m "ilk commit"

# 7. GitHub'a gönder
git branch -M main
git push -u origin main`,
                    },
                    {
                        tip: "uyari",
                        icerik:
                            "İlk push'ta GitHub senden giriş yapmanı isteyebilir. Tarayıcı açılırsa izin ver, ya da Personal Access Token (PAT) oluştur.",
                    },
                    {
                        tip: "foto",
                        src: "/egitim/first-push.png",
                        alt: "Başarılı push çıktısı",
                        aciklama: "Bu çıktıyı görüyorsan dosyaların GitHub'da!",
                    },
                ],
            },
        ],
    },
    {
        no: "02",
        id: "ilk-proje",
        icon: Code2,
        renk: "cyan",
        baslik: "İlk Proje",
        sure: "~60 dk",
        ozet: "HTML, CSS ve JavaScript ile sıfırdan bir web sayfası yaz. VS Code kur, canlı önizleme al.",
        adimlar: [
            {
                no: 1,
                baslik: "VS Code Kur ve Live Server Ekle",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "code.visualstudio.com adresinden VS Code'u indir ve kur. Açtıktan sonra sol taraftaki Extensions ikonuna tıkla (ya da Ctrl+Shift+X) ve 'Live Server' yaz, Ritwick Dey'in eklentisini kur.",
                    },
                    {
                        tip: "foto",
                        src: "/egitim/vscode-live-server.png",
                        alt: "VS Code Live Server eklentisi",
                        aciklama: "Live Server eklentisi kurulunca sağ altta 'Go Live' butonu çıkar.",
                    },
                ],
            },
            {
                no: 2,
                baslik: "index.html, style.css, script.js",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "VS Code'da bir klasör aç (File → Open Folder). İçine bu 3 dosyayı oluştur. Her web projesinin temeli bu 3 dosyadır:",
                    },
                    {
                        tip: "kod",
                        dil: "html",
                        icerik: `<!-- index.html -->
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>İlk Projem</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="kart">
        <h1 id="baslik">Merhaba Dünya!</h1>
        <p>Bu benim ilk web projemdir.</p>
        <button onclick="rengiDegistir()">Renk Değiştir</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                    },
                    {
                        tip: "kod",
                        dil: "css",
                        icerik: `/* style.css */
body {
    background: #0a0a0a;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: sans-serif;
    margin: 0;
}

.kart {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 1rem;
    padding: 2rem 3rem;
    text-align: center;
    color: white;
}

button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
}`,
                    },
                    {
                        tip: "kod",
                        dil: "javascript",
                        icerik: `// script.js
const renkler = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];
let index = 0;

function rengiDegistir() {
    index = (index + 1) % renkler.length;
    document.getElementById("baslik").style.color = renkler[index];
}`,
                    },
                    {
                        tip: "foto",
                        src: "/egitim/ilk-proje-sonuc.png",
                        alt: "İlk projenin tarayıcıdaki görünümü",
                        aciklama: "index.html'e sağ tıkla → 'Open with Live Server' ile tarayıcıda aç.",
                    },
                ],
            },
            {
                no: 3,
                baslik: "DOM Manipülasyonu",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "JavaScript ile HTML elementlerine ulaşıp içeriklerini veya stillerini değiştirebilirsin. En sık kullanılan yöntemler:",
                    },
                    {
                        tip: "kod",
                        dil: "javascript",
                        icerik: `// Elemente ulaş
const baslik = document.getElementById("baslik");
const butonlar = document.querySelectorAll("button");

// İçeriği değiştir
baslik.textContent = "Yeni Başlık!";
baslik.innerHTML = "<em>Eğik</em> Başlık";

// Stil değiştir
baslik.style.color = "red";
baslik.style.fontSize = "2rem";

// Class ekle / çıkar
baslik.classList.add("aktif");
baslik.classList.remove("aktif");
baslik.classList.toggle("aktif");

// Tıklama olayı dinle
baslik.addEventListener("click", () => {
    alert("Başlığa tıklandı!");
});`,
                    },
                ],
            },
            {
                no: 4,
                baslik: "Fetch API ile Veri Çekme",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "Fetch API ile internet üzerindeki verilerle çalışabilirsin. Örnek olarak ücretsiz bir API'den veri çekelim:",
                    },
                    {
                        tip: "kod",
                        dil: "javascript",
                        icerik: `// Ücretsiz bir API'den rastgele aktivite çek
async function aktiviteGetir() {
    try {
        const cevap = await fetch("https://www.boredapi.com/api/activity");
        const veri = await cevap.json();

        document.getElementById("aktivite").textContent = veri.activity;
    } catch (hata) {
        console.error("Veri çekilemedi:", hata);
    }
}

// Sayfa açılınca çalıştır
aktiviteGetir();`,
                    },
                    {
                        tip: "bilgi",
                        icerik:
                            "async/await sözdizimi, veri çekme işlemlerini daha okunabilir yapar. Her zaman try/catch ile hataları yakala.",
                    },
                ],
            },
        ],
    },
    {
        no: "03",
        id: "deploy",
        icon: Globe,
        renk: "blue",
        baslik: "Deploy",
        sure: "~30 dk",
        ozet: "Projeyi Vercel'e bağla, Cloudflare Workers ile API yaz ve internete aç.",
        adimlar: [
            {
                no: 1,
                baslik: "Vercel'e GitHub Repo Bağla",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "vercel.com adresine git, 'Sign Up' → 'Continue with GitHub' seç. Giriş yaptıktan sonra 'Add New Project' → GitHub repounu seç → 'Deploy' butonuna bas. Otomatik olarak projeyi build edip yayınlar.",
                    },
                    {
                        tip: "foto",
                        src: "/egitim/vercel-deploy.png",
                        alt: "Vercel deploy ekranı",
                        aciklama: "Deploy tamamlandığında sana bir .vercel.app URL'i verilir.",
                    },
                    {
                        tip: "bilgi",
                        icerik:
                            "Bundan sonra main branch'e her push yaptığında Vercel otomatik olarak yeniden deploy eder. CI/CD bedavaya geldi!",
                    },
                ],
            },
            {
                no: 2,
                baslik: "Cloudflare Workers Hesabı Aç",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "dash.cloudflare.com adresine git, ücretsiz hesap aç. Sol menüden 'Workers & Pages' → 'Create' → 'Create Worker' seç.",
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# Wrangler CLI'ı kur (Cloudflare'in geliştirme aracı)
npm install -g wrangler

# Giriş yap
wrangler login

# Yeni worker projesi oluştur
wrangler init benim-api
cd benim-api

# Lokalde çalıştır
wrangler dev`,
                    },
                    {
                        tip: "foto",
                        src: "/egitim/wrangler-dev.png",
                        alt: "wrangler dev çıktısı",
                        aciklama: "http://localhost:8787 adresinde Worker'ın çalışıyor.",
                    },
                ],
            },
            {
                no: 3,
                baslik: "İlk API'yi Yaz ve Yayınla",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "src/index.ts dosyasını aç ve basit bir API yaz. Bu API farklı URL'lere gelen isteklere JSON cevap döndürür:",
                    },
                    {
                        tip: "kod",
                        dil: "typescript",
                        icerik: `// src/index.ts
export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        // CORS başlıkları (frontend'den erişim için)
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        // Route'lara göre cevap ver
        if (url.pathname === "/api/merhaba") {
            return Response.json(
                { mesaj: "Merhaba!", zaman: new Date().toISOString() },
                { headers }
            );
        }

        if (url.pathname === "/api/sorular") {
            const sorular = [
                { id: 1, soru: "HTML ne demektir?", cevap: "HyperText Markup Language" },
                { id: 2, soru: "CSS ne için kullanılır?", cevap: "Stil ve tasarım için" },
            ];
            return Response.json({ sorular }, { headers });
        }

        return new Response("Sayfa bulunamadı", { status: 404 });
    },
};`,
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# Deploy et
wrangler deploy

# Çıktı:
# ✅ Deployed to https://benim-api.kulladinim.workers.dev`,
                    },
                ],
            },
            {
                no: 4,
                baslik: "Frontend ile Bağlantı Kur",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "Artık frontend'inden kendi API'na istek atabilirsin. script.js dosyanda Worker URL'ini kullan:",
                    },
                    {
                        tip: "kod",
                        dil: "javascript",
                        icerik: `// script.js — kendi Worker URL'ini yaz
const API_URL = "https://benim-api.kulladinim.workers.dev";

async function soruGetir() {
    const cevap = await fetch(\`\${API_URL}/api/sorular\`);
    const veri = await cevap.json();

    const liste = document.getElementById("sorular");
    veri.sorular.forEach(soru => {
        const li = document.createElement("li");
        li.textContent = soru.soru;
        liste.appendChild(li);
    });
}

soruGetir();`,
                    },
                    {
                        tip: "uyari",
                        icerik:
                            "Eğer 'CORS error' alıyorsan Worker'ında 'Access-Control-Allow-Origin: *' başlığını eklediğinden emin ol.",
                    },
                ],
            },
        ],
    },
    {
        no: "04",
        id: "veritabani",
        icon: Database,
        renk: "violet",
        baslik: "Veritabanı",
        sure: "~50 dk",
        ozet: "Cloudflare D1 ile SQL veritabanı oluştur, Workers'tan veri çek ve frontend'e aktar.",
        adimlar: [
            {
                no: 1,
                baslik: "Cloudflare D1 Oluştur",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "D1, Cloudflare'in SQLite tabanlı bulut veritabanıdır. Workers ile birlikte ücretsiz çalışır. Terminal'de şu komutu çalıştır:",
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# D1 veritabanı oluştur
wrangler d1 create oyun-db

# Çıktıdan database_id'yi kopyala, wrangler.toml'a ekle:
# [[d1_databases]]
# binding = "DB"
# database_name = "oyun-db"
# database_id = "xxxxx-xxxx-xxxx-xxxx-xxxxxxxx"`,
                    },
                    {
                        tip: "foto",
                        src: "/egitim/d1-create.png",
                        alt: "D1 veritabanı oluşturma çıktısı",
                        aciklama: "database_id'yi wrangler.toml dosyasına yapıştır.",
                    },
                ],
            },
            {
                no: 2,
                baslik: "SQL ile Tablo Yaz",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "schema.sql adında bir dosya oluştur, tablolarını tanımla ve D1'e uygula:",
                    },
                    {
                        tip: "kod",
                        dil: "sql",
                        icerik: `-- schema.sql
CREATE TABLE IF NOT EXISTS sorular (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    soru     TEXT    NOT NULL,
    cevap_a  TEXT    NOT NULL,
    cevap_b  TEXT    NOT NULL,
    cevap_c  TEXT    NOT NULL,
    cevap_d  TEXT    NOT NULL,
    dogru    TEXT    NOT NULL,  -- 'A', 'B', 'C' veya 'D'
    kategori TEXT    DEFAULT 'Genel',
    zorluk   INTEGER DEFAULT 1
);

-- Örnek veri ekle
INSERT INTO sorular (soru, cevap_a, cevap_b, cevap_c, cevap_d, dogru, kategori)
VALUES
    ('HTML ne demektir?',
     'HyperText Markup Language',
     'High Tech Modern Language',
     'Hyper Transfer Markup Logic',
     'HyperText Modern Logic',
     'A', 'Web'),
    ('CSS hangi işe yarar?',
     'Veritabanı yönetimi',
     'Sayfa stillendirme',
     'Sunucu programlama',
     'Ağ yönetimi',
     'B', 'Web');`,
                    },
                    {
                        tip: "kod",
                        dil: "bash",
                        icerik: `# Şemayı D1'e uygula
wrangler d1 execute oyun-db --file=./schema.sql

# Lokalde test için:
wrangler d1 execute oyun-db --file=./schema.sql --local`,
                    },
                ],
            },
            {
                no: 3,
                baslik: "Workers'tan Veri Çek / Yaz",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "wrangler.toml'a D1 binding'ini ekledikten sonra Worker'ında DB'ye doğrudan erişebilirsin:",
                    },
                    {
                        tip: "kod",
                        dil: "typescript",
                        icerik: `// src/index.ts
interface Env {
    DB: D1Database;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        // Tüm soruları getir
        if (url.pathname === "/api/sorular") {
            const { results } = await env.DB
                .prepare("SELECT * FROM sorular")
                .all();
            return Response.json({ sorular: results }, { headers });
        }

        // Kategoriye göre getir
        if (url.pathname.startsWith("/api/sorular/")) {
            const kategori = url.pathname.split("/").pop();
            const { results } = await env.DB
                .prepare("SELECT * FROM sorular WHERE kategori = ?")
                .bind(kategori)
                .all();
            return Response.json({ sorular: results }, { headers });
        }

        // Yeni soru ekle (POST)
        if (url.pathname === "/api/sorular" && request.method === "POST") {
            const body = await request.json() as Record<string, string>;
            await env.DB
                .prepare(
                    "INSERT INTO sorular (soru, cevap_a, cevap_b, cevap_c, cevap_d, dogru, kategori) VALUES (?, ?, ?, ?, ?, ?, ?)"
                )
                .bind(body.soru, body.cevap_a, body.cevap_b, body.cevap_c, body.cevap_d, body.dogru, body.kategori)
                .run();
            return Response.json({ basarili: true }, { headers });
        }

        return new Response("Bulunamadı", { status: 404 });
    },
};`,
                    },
                ],
            },
            {
                no: 4,
                baslik: "Frontend'e Tam Entegrasyon",
                icerikler: [
                    {
                        tip: "metin",
                        icerik:
                            "Artık her şey hazır. Frontend'inden veritabanındaki verileri çekip gösterebilirsin:",
                    },
                    {
                        tip: "kod",
                        dil: "javascript",
                        icerik: `// script.js — tam entegrasyon örneği
const API = "https://benim-api.kulladinim.workers.dev";

let sorular = [];
let mevcutSoru = 0;
let puan = 0;

async function oyunuBaslat() {
    // API'den soruları çek
    const res = await fetch(\`\${API}/api/sorular/Web\`);
    const veri = await res.json();
    sorular = veri.sorular;

    soruGoster();
}

function soruGoster() {
    if (mevcutSoru >= sorular.length) {
        document.getElementById("oyun").innerHTML =
            \`<h2>Bitti! Puanın: \${puan}/\${sorular.length}</h2>\`;
        return;
    }

    const s = sorular[mevcutSoru];
    document.getElementById("soru-metni").textContent = s.soru;
    ["A","B","C","D"].forEach(harf => {
        document.getElementById(\`secenek-\${harf}\`).textContent =
            \`\${harf}) \${s[\`cevap_\${harf.toLowerCase()}\`]}\`;
    });
}

function cevapKontrol(secilen) {
    if (secilen === sorular[mevcutSoru].dogru) puan++;
    mevcutSoru++;
    soruGoster();
}

oyunuBaslat();`,
                    },
                    {
                        tip: "bilgi",
                        icerik:
                            "Tebrikler! GitHub → Kod → Deploy → API → Veritabanı zincirinin tamamını öğrendin. Bu akış gerçek projelerin temelini oluşturur.",
                    },
                ],
            },
        ],
    },
];

// ─── Renk Haritası ───────────────────────────────────────────
const renkler: Record<string, {
    border: string; glow: string; badge: string; icon: string;
    no: string; accent: string; accentBg: string; codeHighlight: string;
}> = {
    emerald: {
        border: "hover:border-emerald-500/40",
        glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.08)]",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: "text-emerald-400",
        no: "text-emerald-500/20",
        accent: "text-emerald-400",
        accentBg: "bg-emerald-500/10 border-emerald-500/20",
        codeHighlight: "border-l-emerald-500",
    },
    cyan: {
        border: "hover:border-cyan-500/40",
        glow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.08)]",
        badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        icon: "text-cyan-400",
        no: "text-cyan-500/20",
        accent: "text-cyan-400",
        accentBg: "bg-cyan-500/10 border-cyan-500/20",
        codeHighlight: "border-l-cyan-500",
    },
    blue: {
        border: "hover:border-blue-500/40",
        glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]",
        badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: "text-blue-400",
        no: "text-blue-500/20",
        accent: "text-blue-400",
        accentBg: "bg-blue-500/10 border-blue-500/20",
        codeHighlight: "border-l-blue-500",
    },
    violet: {
        border: "hover:border-violet-500/40",
        glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.08)]",
        badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        icon: "text-violet-400",
        no: "text-violet-500/20",
        accent: "text-violet-400",
        accentBg: "bg-violet-500/10 border-violet-500/20",
        codeHighlight: "border-l-violet-500",
    },
};

// ─── Kod Kopyalama ───────────────────────────────────────────
function KodBlok({ icerik, dil, accentClass }: { icerik: string; dil: string; accentClass: string }) {
    const [kopyalandi, setKopyalandi] = useState(false);

    const kopyala = () => {
        navigator.clipboard.writeText(icerik);
        setKopyalandi(true);
        setTimeout(() => setKopyalandi(false), 2000);
    };

    return (
        <div className={`relative rounded-xl bg-slate-950 border border-slate-800 border-l-2 ${accentClass} overflow-hidden`}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{dil}</span>
                <button
                    onClick={kopyala}
                    className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                    {kopyalandi ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {kopyalandi ? "kopyalandı" : "kopyala"}
                </button>
            </div>
            <pre className="p-4 text-[12px] text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                {icerik}
            </pre>
        </div>
    );
}

// ─── Foto Placeholder ────────────────────────────────────────
function FotoPlaceholder({ src, alt, aciklama }: { src: string; alt: string; aciklama?: string }) {
    return (
        <div className="rounded-xl overflow-hidden border border-slate-800">
            <div className="relative bg-slate-900 aspect-video flex flex-col items-center justify-center gap-3">
                {/* Gerçek resim varsa göster, yoksa placeholder */}
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
                <div className="relative z-10 flex flex-col items-center gap-2 text-slate-600">
                    <ImageIcon size={32} strokeWidth={1} />
                    <span className="text-xs font-mono">{src}</span>
                </div>
            </div>
            {aciklama && (
                <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800">
                    <p className="text-[12px] text-slate-500 leading-relaxed">📌 {aciklama}</p>
                </div>
            )}
        </div>
    );
}

// ─── Adım Bileşeni ───────────────────────────────────────────
function AdimKarti({ adim, renk, index }: { adim: Adim; renk: string; index: number }) {
    const [acik, setAcik] = useState(index === 0);
    const r = renkler[renk];

    return (
        <div className="border border-slate-800/60 rounded-2xl overflow-hidden bg-slate-900/20">
            <button
                onClick={() => setAcik(!acik)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-900/40 transition-colors"
            >
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black ${r.badge}`}>
                    {adim.no}
                </span>
                <span className="flex-1 font-bold text-slate-200 text-sm">{adim.baslik}</span>
                <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-300 ${acik ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {acik && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 space-y-4 border-t border-slate-800/40 pt-4">
                            {adim.icerikler.map((ic, j) => {
                                if (ic.tip === "metin") {
                                    return (
                                        <p key={j} className="text-slate-400 text-sm leading-relaxed">
                                            {ic.icerik}
                                        </p>
                                    );
                                }
                                if (ic.tip === "kod") {
                                    return (
                                        <KodBlok
                                            key={j}
                                            icerik={ic.icerik}
                                            dil={ic.dil}
                                            accentClass={r.codeHighlight}
                                        />
                                    );
                                }
                                if (ic.tip === "foto") {
                                    return (
                                        <FotoPlaceholder
                                            key={j}
                                            src={ic.src}
                                            alt={ic.alt}
                                            aciklama={ic.aciklama}
                                        />
                                    );
                                }
                                if (ic.tip === "uyari") {
                                    return (
                                        <div key={j} className="flex gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                                            <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-amber-300/80 text-sm leading-relaxed">{ic.icerik}</p>
                                        </div>
                                    );
                                }
                                if (ic.tip === "bilgi") {
                                    return (
                                        <div key={j} className="flex gap-3 p-4 rounded-xl bg-sky-500/8 border border-sky-500/20">
                                            <Info size={15} className="text-sky-400 shrink-0 mt-0.5" />
                                            <p className="text-sky-300/80 text-sm leading-relaxed">{ic.icerik}</p>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Bölüm Bileşeni ──────────────────────────────────────────
function BolumDetay({ bolum }: { bolum: Bolum }) {
    const r = renkler[bolum.renk];
    const Icon = bolum.icon;

    return (
        <section id={bolum.id} className="relative z-10 max-w-3xl mx-auto px-6 py-16">
            {/* Bölüm başlığı */}
            <div className="flex items-center gap-4 mb-10">
                <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-800`}>
                    <Icon size={28} className={r.icon} />
                </div>
                <div>
                    <p className={`text-xs font-black tracking-[0.2em] uppercase mb-1 ${r.accent}`}>
                        Bölüm {bolum.no}
                    </p>
                    <h2 className="text-3xl font-[900] text-white tracking-tight">{bolum.baslik}</h2>
                </div>
                <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${r.badge}`}>
                    <Clock size={11} />
                    {bolum.sure}
                </div>
            </div>

            <p className="text-slate-400 text-base leading-relaxed mb-10 pl-1">{bolum.ozet}</p>

            {/* Adımlar */}
            <div className="space-y-3">
                {bolum.adimlar.map((adim, i) => (
                    <AdimKarti key={adim.no} adim={adim} renk={bolum.renk} index={i} />
                ))}
            </div>

            {/* Bölüm sonu */}
            <div className="mt-10 flex items-center gap-4">
                <div className={`h-px flex-1 bg-slate-800`} />
                <span className={`text-xs font-black tracking-widest uppercase ${r.accent} opacity-50`}>
                    Bölüm {bolum.no} Tamamlandı
                </span>
                <div className={`h-px flex-1 bg-slate-800`} />
            </div>
        </section>
    );
}

// ─── Ana Sayfa ───────────────────────────────────────────────
export default function EgitimPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">

            {/* Arka plan */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-cyan-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[25%] bg-violet-500/5 blur-[120px] rounded-full" />
            </div>

            {/* ── HERO ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8"
                >
                    <BookOpen size={13} />
                    11. SINIF WEB GELİŞTİRME EĞİTİMİ
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    className="text-5xl md:text-7xl font-[900] tracking-tight text-white leading-[0.95] mb-6"
                >
                    Sıfırdan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                        Canlıya Al.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed mb-10"
                >
                    GitHub&apos;dan başla, kendi API&apos;nı yaz, veritabanına bağla.
                    Gerçek bir proje — adım adım.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {[
                        { icon: Zap, text: "4 Bölüm" },
                        { icon: Clock, text: "~3 Saat" },
                        { icon: Terminal, text: "HTML · CSS · JS" },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-sm">
                            <Icon size={14} className="text-emerald-400" />
                            {text}
                        </div>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                    <a
                        href="#github"
                        className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-base hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                    >
                        Başla <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </section>

            {/* ── ÖZET KARTLAR ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-slate-800" />
                    <span className="text-xs font-black text-slate-500 tracking-[0.25em] uppercase">Müfredat</span>
                    <div className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bolumler.map((bolum, i) => {
                        const r = renkler[bolum.renk];
                        const Icon = bolum.icon;
                        return (
                            <motion.a
                                key={bolum.no}
                                href={`#${bolum.id}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className={`relative p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm transition-all duration-500 group ${r.border} ${r.glow} no-underline block`}
                            >
                                <span className={`absolute top-6 right-8 text-6xl font-[900] ${r.no} select-none`}>
                                    {bolum.no}
                                </span>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-500">
                                        <Icon size={22} className={r.icon} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-1">
                                            Bölüm {bolum.no}
                                        </p>
                                        <h3 className="text-xl font-black text-white tracking-tight">{bolum.baslik}</h3>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-4 ${r.badge}`}>
                                    <Clock size={11} />
                                    {bolum.sure}
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{bolum.ozet}</p>
                                <div className="flex items-center gap-2 text-xs font-bold">
                                    <span className={r.accent}>Bölüme Git</span>
                                    <ChevronRight size={14} className={`${r.accent} group-hover:translate-x-1 transition-transform`} />
                                </div>
                                <div className="mt-6 h-px w-12 bg-slate-700 group-hover:w-full transition-all duration-700 rounded-full" />
                            </motion.a>
                        );
                    })}
                </div>
            </section>

            {/* ── AYRAÇ ── */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>

            {/* ── TÜM BÖLÜMLER ── */}
            {bolumler.map((bolum, i) => (
                <div key={bolum.id}>
                    <BolumDetay bolum={bolum} />
                    {i < bolumler.length - 1 && (
                        <div className="relative z-10 max-w-3xl mx-auto px-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                        </div>
                    )}
                </div>
            ))}

            {/* ── TECH STACK ── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
                <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50">
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.25em] uppercase text-center mb-8">
                        Kullandığın Teknolojiler
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "HTML5", "CSS3", "JavaScript",
                            "Git", "GitHub", "VS Code",
                            "Vercel", "Cloudflare Workers", "Cloudflare D1",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-emerald-500/40 hover:text-emerald-400 transition-colors cursor-default"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-slate-500 text-sm mb-6 font-mono tracking-widest uppercase">
                        // hazır mısın?
                    </p>
                    <Link
                        href="#github"
                        className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]"
                    >
                        Bölüm 1&apos;e Başla
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}