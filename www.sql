BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user" (
	"id"	varchar(30),
	"pw"	varchar(30),
	"dt"	char(19)
);
CREATE TABLE IF NOT EXISTS "cms" (
	"id"	INTEGER NOT NULL DEFAULT 1,
	"pid"	INTEGER NOT NULL DEFAULT 1,
	"sort"	INTEGER NOT NULL DEFAULT 1,
	"display"	INTEGER NOT NULL DEFAULT 0,
	"cate"	TEXT NOT NULL DEFAULT 'menu',
	"name"	TEXT NOT NULL,
	"link"	TEXT,
	"target"	TEXT,
	"content"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "user" VALUES ('usk@kakao.com','1234','2025-12-12 09:00:00');

INSERT INTO "cms" VALUES (1,1,1,1,'menu','인공지능',NULL,NULL,NULL),
 (2,2,1,1,'menu','미디어',NULL,NULL,NULL),
 (3,3,1,1,'menu','정보풀',NULL,NULL,NULL),
 (4,4,1,0,'menu','',NULL,NULL,NULL),
 (5,5,1,0,'menu','',NULL,NULL,NULL),
 (6,6,1,0,'menu','',NULL,NULL,NULL),
 (7,7,1,0,'menu','',NULL,NULL,NULL),
 (8,8,1,0,'menu','',NULL,NULL,NULL),
 (9,9,1,0,'menu','',NULL,NULL,NULL),
 (10,10,1,0,'menu','',NULL,NULL,NULL),
 (11,1,1,1,'menu','번역',NULL,NULL,NULL),
 (12,1,2,1,'menu','음성메모',NULL,NULL,NULL);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user" ON "user" (
	"id"	ASC
);
COMMIT;
