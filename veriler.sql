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
INSERT INTO "questions_bilisim" VALUES(2,'asdsdasdfdsfasfa','["asd","das","dsa","asd"]',1,2);
INSERT INTO "questions_bilisim" VALUES(4,'naber','["iyi sen","iyi ben","iyi annen","naber"]',1,2);
INSERT INTO "questions_bilisim" VALUES(7,'sads','["sdas","sdsa","sadsd","dad"]',0,1);
INSERT INTO "questions_bilisim" VALUES(8,'sadsd','["asd","asdas","ads","dasd"]',1,1);
INSERT INTO "questions_bilisim" VALUES(9,'dsad','["adsa","asd","asda","asd"]',1,1);
INSERT INTO "questions_bilisim" VALUES(10,'asdsa','["ddas","das","dasd","da"]',1,1);
INSERT INTO "questions_bilisim" VALUES(11,'das','["das","das","das","sad"]',1,2);
INSERT INTO "questions_bilisim" VALUES(12,'adsds','["das","adads","d","sdas"]',1,3);
INSERT INTO "questions_bilisim" VALUES(13,'dasds','["ads","dsd","das","dasdsa"]',1,3);
INSERT INTO "questions_bilisim" VALUES(14,'SAD','["SAD","DSA","ADS","DSA"]',3,1);
INSERT INTO "questions_bilisim" VALUES(15,'SAD','["SAD","DSA","ADS","DSA"]',3,1);
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
INSERT INTO "tabu_fizik" VALUES(13,'deneme','["1","2","3","4","5"]',0);
INSERT INTO "tabu_fizik" VALUES(14,'asd','["sda","dsa","dsa","sda","sasda"]',1);
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
INSERT INTO "team_answers" VALUES('WGSD-GTQQ','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('DTAU-89FF','Kırmızı','B',0,0);
INSERT INTO "team_answers" VALUES('WYBJ-CE3F','Kırmızı','B',0,0);
INSERT INTO "team_answers" VALUES('MGYQ-J49T','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('866H-TU49','Kırmızı','B',0,0);
INSERT INTO "team_answers" VALUES('35SR-LM98','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('DD7Z-HJUT','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('XYSJ-JTWP','Kırmızı','B',0,0);
INSERT INTO "team_answers" VALUES('GSUJ-9AJN','Yeşil',NULL,0,0);
INSERT INTO "team_answers" VALUES('GSUJ-9AJN','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('ERZ6-QH9S','Mavi','D',0,0);
INSERT INTO "team_answers" VALUES('RTJZ-W9LQ','Sarı','D',0,0);
INSERT INTO "team_answers" VALUES('VRFT-LXZQ','Sarı',NULL,0,20);
INSERT INTO "team_answers" VALUES('VRFT-LXZQ','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('6GHJ-6GFC','Kırmızı','B',1,10);
INSERT INTO "team_answers" VALUES('6GHJ-6GFC','Mavi','A',0,0);
INSERT INTO "team_answers" VALUES('JATP-UXY3','Mavi','C',0,10);
INSERT INTO "team_answers" VALUES('7URA-9T6Z','Mavi',NULL,0,0);
INSERT INTO "team_answers" VALUES('JG6Y-XTLV','Mavi','A',0,0);
INSERT INTO "team_answers" VALUES('VKTY-PNZY','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('DDBZ-8QGQ','Kırmızı',NULL,0,20);
INSERT INTO "team_answers" VALUES('JGM2-QCGD','Kırmızı','B',0,10);
INSERT INTO "team_answers" VALUES('VQ9V-LYUX','Kırmızı',NULL,0,30);
INSERT INTO "team_answers" VALUES('BSZJ-4VTS','Kırmızı',NULL,0,20);
INSERT INTO "team_answers" VALUES('UAFB-PJP8','Kırmızı',NULL,0,10);
INSERT INTO "team_answers" VALUES('UAFB-PJP8','Mavi','A',0,250);
INSERT INTO "team_answers" VALUES('LYMU-RD3X','Mavi','A',0,0);
INSERT INTO "team_answers" VALUES('LYMU-RD3X','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('889R-NPQZ','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('R544-3MER','Mavi','B',0,0);
INSERT INTO "team_answers" VALUES('R544-3MER','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('D8GL-MWUC','Mavi','A',0,0);
INSERT INTO "team_answers" VALUES('RH5F-ED5K','Kırmızı','A',1,10);
INSERT INTO "team_answers" VALUES('3KKU-JTH9','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('8LDQ-VJP8','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('9DGU-UULA','Kırmızı','C',0,0);
INSERT INTO "team_answers" VALUES('ULK6-WR2E','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('D3NC-2YJQ','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('6Z7L-CMQV','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('P57J-SA42','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('P57J-SA42','Mavi',NULL,0,0);
INSERT INTO "team_answers" VALUES('G8ZP-DEJJ','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('44GD-XBUH','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('EXZX-8ZSL','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('VPR9-V8TH','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('7BH3-GYY5','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('LYBZ-JC65','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('4LEB-EFNS','Mavi',NULL,0,0);
INSERT INTO "team_answers" VALUES('AFZB-MXGE','Sarı','A',0,0);
INSERT INTO "team_answers" VALUES('K7F4-KQ7A','Kırmızı',NULL,0,0);
INSERT INTO "team_answers" VALUES('4TCS-Y22Y','Mavi',NULL,0,0);
INSERT INTO "team_answers" VALUES('JMGV-FMJG','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('TGAQ-3CFG','Mavi','A',0,0);
INSERT INTO "team_answers" VALUES('KJU5-RXMA','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('YJC5-P4LA','Kırmızı','A',0,0);
INSERT INTO "team_answers" VALUES('2YYC-K8QW','Kırmızı',NULL,0,20);
INSERT INTO "team_answers" VALUES('VEC3-2U67','Kırmızı','A',1,40);
INSERT INTO "team_answers" VALUES('VEC3-2U67','Seyirci',NULL,0,0);
INSERT INTO "team_answers" VALUES('D3MS-9AWR','Seyirci',NULL,0,0);
INSERT INTO "team_answers" VALUES('D3MS-9AWR','Kırmızı','A',1,40);
INSERT INTO "team_answers" VALUES('PLAE-57JM','Kırmızı','C',1,30);
INSERT INTO "team_answers" VALUES('G5WW-5N8H','Kırmızı','D',1,30);
INSERT INTO "team_answers" VALUES('G5WW-5N8H','Mavi',NULL,0,10);
INSERT INTO "team_answers" VALUES('FH78-UDUP','Kırmızı',NULL,0,20);
INSERT INTO "team_answers" VALUES('FH78-UDUP','Mavi',NULL,0,10);
INSERT INTO "team_answers" VALUES('AY44-D8KV','Kırmızı','A',0,10);
INSERT INTO "team_answers" VALUES('QTPM-WGSM','Mavi',NULL,0,0);
INSERT INTO "team_answers" VALUES('9SW4-CSRB','Kırmızı','B',1,10);
INSERT INTO "team_answers" VALUES('C8KR-MRDJ','Kırmızı',NULL,0,0);
CREATE TABLE sessions (
  groupCode TEXT PRIMARY KEY,
  category TEXT,
  status TEXT
, currentQuestionIndex INTEGER DEFAULT 0);
INSERT INTO "sessions" VALUES('ARC5-62T8','bilisim','active',0);
INSERT INTO "sessions" VALUES('3DVM-DMZS','bilisim','active',0);
INSERT INTO "sessions" VALUES('G2DL-QWTD','bilisim','active',0);
INSERT INTO "sessions" VALUES('46U8-VCLW','bilisim','active',0);
INSERT INTO "sessions" VALUES('N2VC-FD2S','bilisim','active',0);
INSERT INTO "sessions" VALUES('F5Z9-AR44','bilisim','active',0);
INSERT INTO "sessions" VALUES('G6SF-3P72','bilisim','active',0);
INSERT INTO "sessions" VALUES('ZX67-S3CM','bilisim','active',0);
INSERT INTO "sessions" VALUES('QXTB-PM4F','bilisim','active',0);
INSERT INTO "sessions" VALUES('3KZD-MCDC','bilisim','active',0);
INSERT INTO "sessions" VALUES('68WB-XQNE','bilisim','active',0);
INSERT INTO "sessions" VALUES('FDSF-BTRZ','bilisim','active',0);
INSERT INTO "sessions" VALUES('FBJY-QDDP','bilisim','active',0);
INSERT INTO "sessions" VALUES('KEP6-UA9G','bilisim','active',0);
INSERT INTO "sessions" VALUES('WGSD-GTQQ','bilisim','active',0);
INSERT INTO "sessions" VALUES('DTAU-89FF','tabu_fizik','active',0);
INSERT INTO "sessions" VALUES('WYBJ-CE3F','bilisim','active',0);
INSERT INTO "sessions" VALUES('MGYQ-J49T','bilisim','active',0);
INSERT INTO "sessions" VALUES('CR7M-VCLW','bilisim','active',0);
INSERT INTO "sessions" VALUES('UWSN-PABF','bilisim','active',0);
INSERT INTO "sessions" VALUES('866H-TU49','bilisim','finished',0);
INSERT INTO "sessions" VALUES('35SR-LM98','bilisim','finished',9);
INSERT INTO "sessions" VALUES('DD7Z-HJUT','bilisim','active',1);
INSERT INTO "sessions" VALUES('XYSJ-JTWP','bilisim','active',0);
INSERT INTO "sessions" VALUES('GSUJ-9AJN','bilisim','finished',3);
INSERT INTO "sessions" VALUES('ERZ6-QH9S','bilisim','finished',11);
INSERT INTO "sessions" VALUES('RTJZ-W9LQ','bilisim','active',0);
INSERT INTO "sessions" VALUES('X8AX-9JUZ','bilisim','finished',0);
INSERT INTO "sessions" VALUES('8UDK-44K8','bilisim','active',0);
INSERT INTO "sessions" VALUES('Z3GY-QN3A','bilisim','active',0);
INSERT INTO "sessions" VALUES('8L3T-2XVP','bilisim','finished',0);
INSERT INTO "sessions" VALUES('VRFT-LXZQ','bilisim','finished',6);
INSERT INTO "sessions" VALUES('4QZX-BAUE','bilisim','active',0);
INSERT INTO "sessions" VALUES('5B4G-9K6G','bilisim','active',0);
INSERT INTO "sessions" VALUES('AQKP-BHAJ','bilisim','active',0);
INSERT INTO "sessions" VALUES('CSK9-77QA','tabu_fizik','active',0);
INSERT INTO "sessions" VALUES('AJ5U-AUWE','tabu_fizik','active',0);
INSERT INTO "sessions" VALUES('6GHJ-6GFC','bilisim','active',0);
INSERT INTO "sessions" VALUES('JATP-UXY3','bilisim','finished',2);
INSERT INTO "sessions" VALUES('MSW2-D4M4','multigame','finished',1);
INSERT INTO "sessions" VALUES('7URA-9T6Z','multigame','finished',3);
INSERT INTO "sessions" VALUES('GZ7Z-H2NE','multigame','active',0);
INSERT INTO "sessions" VALUES('JG6Y-XTLV','multigame','finished',1);
INSERT INTO "sessions" VALUES('589U-5NRQ','multigame','finished',0);
INSERT INTO "sessions" VALUES('VRH3-QJAJ','multigame','active',0);
INSERT INTO "sessions" VALUES('PXS5-U4RR','multigame','finished',0);
INSERT INTO "sessions" VALUES('GTPW-PBWD','multigame','active',0);
INSERT INTO "sessions" VALUES('Q94T-D4EW','multigame','active',0);
INSERT INTO "sessions" VALUES('VKTY-PNZY','multigame','active',3);
INSERT INTO "sessions" VALUES('DDBZ-8QGQ','multigame','active',11);
INSERT INTO "sessions" VALUES('TCY9-AUTH','multigame','active',5);
INSERT INTO "sessions" VALUES('HY6P-7S9M','multigame','active',0);
INSERT INTO "sessions" VALUES('AHEN-HTN7','multigame','finished',0);
INSERT INTO "sessions" VALUES('JGM2-QCGD','multigame','active',2);
INSERT INTO "sessions" VALUES('6DCR-SJPJ','multigame','finished',1);
INSERT INTO "sessions" VALUES('VQ9V-LYUX','multigame','finished',6);
INSERT INTO "sessions" VALUES('XG2V-GKCF','multigame','finished',0);
INSERT INTO "sessions" VALUES('BSZJ-4VTS','multigame','finished',3);
INSERT INTO "sessions" VALUES('UAFB-PJP8','multigame','finished',6);
INSERT INTO "sessions" VALUES('EDMK-LMTD','multigame','finished',0);
INSERT INTO "sessions" VALUES('VV3F-M6N3','multigame','finished',0);
INSERT INTO "sessions" VALUES('4YCY-Q9X3','multigame','finished',0);
INSERT INTO "sessions" VALUES('LYMU-RD3X','multigame','finished',1);
INSERT INTO "sessions" VALUES('JC7A-4ENY','multigame','finished',0);
INSERT INTO "sessions" VALUES('B7GP-SW7E','multigame','finished',0);
INSERT INTO "sessions" VALUES('YJED-2J52','multigame','active',0);
INSERT INTO "sessions" VALUES('3D24-F7CX','multigame','active',0);
INSERT INTO "sessions" VALUES('TBYS-364P','multigame','active',0);
INSERT INTO "sessions" VALUES('7SHF-VP59','multigame','finished',0);
INSERT INTO "sessions" VALUES('K26G-M8TF','multigame','finished',0);
INSERT INTO "sessions" VALUES('QQ3L-A35F','multigame','finished',0);
INSERT INTO "sessions" VALUES('JZ9P-V6GM','multigame','finished',0);
INSERT INTO "sessions" VALUES('WU7V-P6R3','multigame','active',0);
INSERT INTO "sessions" VALUES('EM9S-7MV7','multigame','finished',0);
INSERT INTO "sessions" VALUES('889R-NPQZ','multigame','finished',0);
INSERT INTO "sessions" VALUES('HZHT-Q7ND','multigame','finished',1);
INSERT INTO "sessions" VALUES('GLT6-K6FE','multigame','finished',0);
INSERT INTO "sessions" VALUES('R544-3MER','multigame','finished',1);
INSERT INTO "sessions" VALUES('D8GL-MWUC','multigame','finished',0);
INSERT INTO "sessions" VALUES('RH5F-ED5K','multigame','active',0);
INSERT INTO "sessions" VALUES('3KKU-JTH9','multigame','finished',1);
INSERT INTO "sessions" VALUES('8LDQ-VJP8','multigame','finished',1);
INSERT INTO "sessions" VALUES('DWQ9-Q5NQ','multigame','finished',0);
INSERT INTO "sessions" VALUES('53M5-H7BF','multigame','finished',0);
INSERT INTO "sessions" VALUES('E3WA-X36Q','multigame','finished',0);
INSERT INTO "sessions" VALUES('RP5T-UQ72','multigame','finished',0);
INSERT INTO "sessions" VALUES('YDZS-H5ZE','multigame','active',0);
INSERT INTO "sessions" VALUES('TPQ8-49JH','multigame','finished',0);
INSERT INTO "sessions" VALUES('9DGU-UULA','multigame','active',0);
INSERT INTO "sessions" VALUES('ULK6-WR2E','multigame','active',0);
INSERT INTO "sessions" VALUES('NB9K-QDZW','multigame','active',0);
INSERT INTO "sessions" VALUES('QBNA-DC8Z','multigame','finished',0);
INSERT INTO "sessions" VALUES('JM42-8ZAR','multigame','finished',0);
INSERT INTO "sessions" VALUES('D3NC-2YJQ','multigame','active',0);
INSERT INTO "sessions" VALUES('RG6Z-C6J4','multigame','waiting',0);
INSERT INTO "sessions" VALUES('6Z7L-CMQV','multigame','finished',1);
INSERT INTO "sessions" VALUES('SSTT-AL28','multigame','waiting',0);
INSERT INTO "sessions" VALUES('P57J-SA42','multigame','finished',2);
INSERT INTO "sessions" VALUES('G8ZP-DEJJ','multigame','waiting',0);
INSERT INTO "sessions" VALUES('R5GB-5EGM','multigame','waiting',0);
INSERT INTO "sessions" VALUES('GBFJ-EJU5','multigame','finished',26);
INSERT INTO "sessions" VALUES('WLFZ-P9Q8','multigame','finished',2);
INSERT INTO "sessions" VALUES('WZHY-HFEF','multigame','finished',2);
INSERT INTO "sessions" VALUES('6FF6-FC37','multigame','finished',2);
INSERT INTO "sessions" VALUES('EZMR-F2GR','multigame','active',2);
INSERT INTO "sessions" VALUES('WXL5-3X9P','multigame','active',1);
INSERT INTO "sessions" VALUES('CGTW-E2Z4','multigame','waiting',12);
INSERT INTO "sessions" VALUES('44GD-XBUH','multigame','active',1);
INSERT INTO "sessions" VALUES('TSZA-LRK7','multigame','waiting',0);
INSERT INTO "sessions" VALUES('5PEV-WQG4','multigame','finished',0);
INSERT INTO "sessions" VALUES('C3KP-VU2R','multigame','waiting',0);
INSERT INTO "sessions" VALUES('EXZX-8ZSL','multigame','active',2);
INSERT INTO "sessions" VALUES('VPR9-V8TH','multigame','active',7);
INSERT INTO "sessions" VALUES('7BH3-GYY5','multigame','active',7);
INSERT INTO "sessions" VALUES('BMUC-QLHD','multigame','waiting',0);
INSERT INTO "sessions" VALUES('LYBZ-JC65','multigame','active',1);
INSERT INTO "sessions" VALUES('4LEB-EFNS','multigame','active',0);
INSERT INTO "sessions" VALUES('AFZB-MXGE','multigame','active',2);
INSERT INTO "sessions" VALUES('K7F4-KQ7A','multigame','active',4);
INSERT INTO "sessions" VALUES('4TCS-Y22Y','multigame','active',3);
INSERT INTO "sessions" VALUES('NK3A-EJX2','multigame','active',1);
INSERT INTO "sessions" VALUES('JMGV-FMJG','multigame','active',4);
INSERT INTO "sessions" VALUES('TGAQ-3CFG','multigame','active',2);
INSERT INTO "sessions" VALUES('KJU5-RXMA','multigame','finished',2);
INSERT INTO "sessions" VALUES('YJC5-P4LA','multigame','finished',0);
INSERT INTO "sessions" VALUES('2YYC-K8QW','multigame','finished',20);
INSERT INTO "sessions" VALUES('VEC3-2U67','multigame','finished',4);
INSERT INTO "sessions" VALUES('D3MS-9AWR','multigame','finished',6);
INSERT INTO "sessions" VALUES('PLAE-57JM','multigame','active',10);
INSERT INTO "sessions" VALUES('G5WW-5N8H','multigame','finished',2);
INSERT INTO "sessions" VALUES('FH78-UDUP','multigame','active',2);
INSERT INTO "sessions" VALUES('AY44-D8KV','multigame','active',2);
INSERT INTO "sessions" VALUES('QTPM-WGSM','multigame','finished',2);
INSERT INTO "sessions" VALUES('9SW4-CSRB','multigame','finished',0);
INSERT INTO "sessions" VALUES('C8KR-MRDJ','multigame','active',0);
INSERT INTO "sessions" VALUES('5AFJ-RR88','multigame','waiting',0);
INSERT INTO "sessions" VALUES('MAHQ-5M8Q','multigame','waiting',0);
INSERT INTO "sessions" VALUES('JREE-XAHH','multigame','waiting',0);
INSERT INTO "sessions" VALUES('UBHT-9G3E','multigame','waiting',0);
INSERT INTO "sessions" VALUES('BASQ-PEHK','multigame','waiting',0);
INSERT INTO "sessions" VALUES('U4R9-DHZD','multigame','waiting',0);
INSERT INTO "sessions" VALUES('RB9D-7S9E','multigame','waiting',0);
INSERT INTO "sessions" VALUES('N44W-GJ3Q','multigame','waiting',0);
INSERT INTO "sessions" VALUES('KHVE-DXLS','multigame','waiting',0);
INSERT INTO "sessions" VALUES('QF22-RBDS','multigame','waiting',0);
INSERT INTO "sessions" VALUES('FKPP-LSYQ','multigame','waiting',0);
INSERT INTO "sessions" VALUES('BRFB-NM3K','multigame','waiting',0);
INSERT INTO "sessions" VALUES('9YZF-7V46','multigame','waiting',0);
INSERT INTO "sessions" VALUES('7HNE-H99N','multigame','waiting',0);
INSERT INTO "sessions" VALUES('ZJ4X-Z43Z','multigame','waiting',0);
INSERT INTO "sessions" VALUES('8FRL-Y574','multigame','waiting',0);
INSERT INTO "sessions" VALUES('UMGA-8PHD','multigame','waiting',0);
INSERT INTO "sessions" VALUES('HH79-BRWA','multigame','waiting',0);
INSERT INTO "sessions" VALUES('C676-UWTZ','multigame','waiting',0);
INSERT INTO "sessions" VALUES('7TDN-LLDQ','multigame','waiting',0);
INSERT INTO "sessions" VALUES('FXGQ-ACST','multigame','waiting',0);
INSERT INTO "sessions" VALUES('BM7A-37EQ','multigame','waiting',0);
INSERT INTO "sessions" VALUES('JR2W-5UY4','multigame','waiting',0);
INSERT INTO "sessions" VALUES('XBUM-QZFR','ARENA SAVAŞI','waiting',0);
INSERT INTO "sessions" VALUES('R42V-4WVB','ARENA SAVAŞI','waiting',0);
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
