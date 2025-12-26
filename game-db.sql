PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson TEXT, 
    question TEXT,
    options TEXT, 
    correctAnswer INTEGER,
    level INTEGER
);
CREATE TABLE questions_fizik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    options TEXT,
    correctAnswer INTEGER,
    level INTEGER
);
INSERT INTO "questions_fizik" VALUES(1,'Suyun kaldırma kuvvetini kim bulmuştur?','["Newton", "Einstein", "Arşimet", "Tesla"]',2,1);
INSERT INTO "questions_fizik" VALUES(2,'newton','["naber","ıyı","sen","ıyı"]',0,2);
INSERT INTO "questions_fizik" VALUES(3,'wewqe','["ewq","eqw","wqe","eq"]',0,1);
INSERT INTO "questions_fizik" VALUES(4,'wewqe','["ewq","eqw","wqe","eq"]',0,1);
INSERT INTO "questions_fizik" VALUES(5,'wewqe','["ewq","eqw","wqe","eq"]',0,1);
CREATE TABLE questions_bilisim (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    options TEXT, -- ["a", "b", "c", "d"]
    correctAnswer INTEGER,
    level INTEGER
);
INSERT INTO "questions_bilisim" VALUES(1,'RAM ne işe yarar?','["Depolama", "Geçici Hafıza", "Görüntü İşleme", "Ses Çıkışı"]',1,1);
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
);
INSERT INTO "users" VALUES(1,'admin','123','admin');
CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    isActive INTEGER,
    category TEXT,
    slug TEXT
);
INSERT INTO "games" VALUES(1,'Kim 1024 GB İster?',1,'Bilişim','quiz');
INSERT INTO "games" VALUES(2,'MultiGame',1,'genel','multigame');
INSERT INTO "games" VALUES(3,'Tabu',1,'genel','tabu');
CREATE TABLE questions_quiz (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correctAnswer INTEGER NOT NULL,
    level INTEGER DEFAULT 1,
    category TEXT NOT NULL -- 'bilisim', 'fizik', 'matematik' buraya yazılacak!
);
CREATE TABLE questions_matematik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON formatında saklanacak
    correctAnswer INTEGER NOT NULL,
    level INTEGER NOT NULL
);
INSERT INTO "questions_matematik" VALUES(1,'Kök 144 dışarıya nasıl çıkar?','["10", "11", "12", "13"]',2,1);
CREATE TABLE tabu_fizik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    forbidden_words TEXT NOT NULL, -- JSON formatında
    isExtra INTEGER DEFAULT 0      -- 0: Normal, 1: Bonus Puan
);
INSERT INTO "tabu_fizik" VALUES(1,'Vektör','["Yön", "Büyüklük", "Ok", "Skaler", "Kuvvet"]',0);
INSERT INTO "tabu_fizik" VALUES(2,'Sürtünme','["Kuvvet", "Isı", "Yüzey", "Enerji", "Kayma"]',0);
INSERT INTO "tabu_fizik" VALUES(3,'Atom','["Çekirdek", "Proton", "Elektron", "Nötron", "Madde"]',1);
INSERT INTO "tabu_fizik" VALUES(4,'Kırılma','["Işık", "Mercek", "Su", "Ortam", "Yansıma"]',0);
INSERT INTO "tabu_fizik" VALUES(5,'Kütle','["Ağırlık", "Kilogram", "Madde", "Hacim", "Terazi"]',0);
INSERT INTO "tabu_fizik" VALUES(6,'Basınç','["Katı", "Sıvı", "Gaz", "Yüzey", "Pascal"]',0);
INSERT INTO "tabu_fizik" VALUES(7,'Kara Delik','["Işık", "Uzay", "Yıldız", "Yerçekimi", "Einstein"]',1);
INSERT INTO "tabu_fizik" VALUES(8,'Direnç','["Elektrik", "Akım", "Ohm", "Devre", "İletken"]',0);
INSERT INTO "tabu_fizik" VALUES(9,'Frekans','["Dalga", "Hertz", "Ses", "Titreşim", "Süre"]',0);
INSERT INTO "tabu_fizik" VALUES(10,'İvme','["Hız", "Zaman", "Birim", "Değişim", "Kuvvet"]',0);
INSERT INTO "tabu_fizik" VALUES(11,'Potansiyel Enerji','["Yükseklik", "Durum", "Kinetik", "Depo", "Yerçekimi"]',0);
INSERT INTO "tabu_fizik" VALUES(12,'Fizyon','["Nükleer", "Parçalanma", "Atom", "Enerji", "Bölünme"]',1);
CREATE TABLE tabu_edebiyat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    forbidden_words TEXT NOT NULL,
    isExtra INTEGER DEFAULT 0
);
INSERT INTO "tabu_edebiyat" VALUES(1,'deneme','["sıdosduf","ıo","uğuıo","ıo","ıou"]',0);
CREATE TABLE team_answers (
  groupCode TEXT,
  teamName TEXT,
  selectedAnswer TEXT,
  isCorrect INTEGER, score INTEGER DEFAULT 0,
  PRIMARY KEY (groupCode, teamName)
);
INSERT INTO "team_answers" VALUES('FBJY-QDDP','Kırmızı','D',0,0);
CREATE TABLE sessions (
  groupCode TEXT PRIMARY KEY,
  category TEXT,
  status TEXT
, currentQuestionIndex INTEGER DEFAULT 0);
INSERT INTO "sessions" VALUES('44GD-XBUH','multigame','active',1);
INSERT INTO "sessions" VALUES('TSZA-LRK7','multigame','waiting',0);
INSERT INTO "sessions" VALUES('5PEV-WQG4','multigame','finished',0);
CREATE TABLE multigame (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ders TEXT,
    question TEXT,
    options TEXT,
    correctAnswer TEXT,
    sure INTEGER DEFAULT 30
);
INSERT INTO "multigame" VALUES(14,'Genel Kültür','İstiklal Marşı''mızın bestecisi kimdir?','{"A": "Zeki Üngör", "B": "Osman Zeki Üngör", "C": "Mehmet Akif Ersoy", "D": "Münir Nurettin Selçuk"}','B',30);
INSERT INTO "multigame" VALUES(15,'Genel Kültür','Türkiye''nin en büyük gölü hangisidir?','{"A": "Tuz Gölü", "B": "Eğirdir Gölü", "C": "Van Gölü", "D": "Beyşehir Gölü"}','C',20);
INSERT INTO "multigame" VALUES(16,'Tarih','Osmanlı İmparatorluğu''nun ilk başkenti neresidir?','{"A": "İstanbul", "B": "Bursa", "C": "Edirne", "D": "Söğüt"}','D',20);
INSERT INTO "multigame" VALUES(17,'Coğrafya','Dünyanın en yüksek dağı hangisidir?','{"A": "Everest", "B": "K2", "C": "Ağrı Dağı", "D": "Kilimanjaro"}','A',20);
INSERT INTO "multigame" VALUES(18,'Sanat','Mona Lisa tablosu hangi ünlü ressama aittir?','{"A": "Picasso", "B": "Vincent van Gogh", "C": "Leonardo da Vinci", "D": "Salvador Dali"}','C',30);
INSERT INTO "multigame" VALUES(19,'Bilim','Suyun kimyasal formülü nedir?','{"A": "CO2", "B": "H2O", "C": "O2", "D": "NaCl"}','B',15);
INSERT INTO "multigame" VALUES(20,'Edebiyat','Sefiller adlı romanın yazarı kimdir?','{"A": "Dostoyevski", "B": "Victor Hugo", "C": "Tolstoy", "D": "Balzac"}','B',30);
INSERT INTO "multigame" VALUES(21,'Spor','İlk modern Olimpiyat Oyunları nerede düzenlenmiştir?','{"A": "Roma", "B": "Atina", "C": "Londra", "D": "Paris"}','B',25);
INSERT INTO "multigame" VALUES(22,'Müzik','Klasik müziğin babası olarak bilinen besteci kimdir?','{"A": "Beethoven", "B": "Mozart", "C": "Bach", "D": "Vivaldi"}','C',30);
INSERT INTO "multigame" VALUES(23,'Teknoloji','Dünyanın ilk bilgisayarı olarak kabul edilen cihazın adı nedir?','{"A": "Apple I", "B": "ENIAC", "C": "Commodore 64", "D": "IBM PC"}','B',30);
INSERT INTO "multigame" VALUES(24,'Coğrafya','Yüzölçümü bakımından dünyanın en büyük ülkesi hangisidir?','{"A": "Çin", "B": "ABD", "C": "Rusya", "D": "Kanada"}','C',20);
INSERT INTO "multigame" VALUES(25,'Tarih','Atatürk''ün doğum yılı kaçtır?','{"A": "1880", "B": "1881", "C": "1882", "D": "1919"}','B',15);
INSERT INTO "multigame" VALUES(26,'Genel Kültür','Nobel Barış Ödülü hangi ülkede verilir?','{"A": "İsveç", "B": "Norveç", "C": "İsviçre", "D": "Almanya"}','B',30);
INSERT INTO "multigame" VALUES(27,'Bilim','Güneş sistemindeki en büyük gezegen hangisidir?','{"A": "Mars", "B": "Satürn", "C": "Jüpiter", "D": "Dünya"}','C',20);
INSERT INTO "multigame" VALUES(28,'Genel Kültür','Bir gün kaç dakikadır?','{"A": "1200", "B": "1440", "C": "1500", "D": "1680"}','B',20);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('questions',1);
INSERT INTO "sqlite_sequence" VALUES('questions_bilisim',15);
INSERT INTO "sqlite_sequence" VALUES('questions_fizik',5);
INSERT INTO "sqlite_sequence" VALUES('users',1);
INSERT INTO "sqlite_sequence" VALUES('games',5);
INSERT INTO "sqlite_sequence" VALUES('questions_quiz',3);
INSERT INTO "sqlite_sequence" VALUES('questions_matematik',1);
INSERT INTO "sqlite_sequence" VALUES('tabu_fizik',14);
INSERT INTO "sqlite_sequence" VALUES('tabu_edebiyat',1);
INSERT INTO "sqlite_sequence" VALUES('multigame',28);
