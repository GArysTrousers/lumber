CREATE TABLE
  "apikey" (
    "id" INTEGER NULL,
    "name" VARCHAR(64) NOT NULL DEFAULT '',
    "code" VARCHAR(64) NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL DEFAULT '',
    PRIMARY KEY ("id")
  );

CREATE TABLE
  "log" (
    "id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "type" VARCHAR(32) NULL DEFAULT NULL,
    "message" VARCHAR(256) NULL DEFAULT NULL,
    "user" VARCHAR(32) NULL DEFAULT NULL,
    "machine" VARCHAR(32) NULL DEFAULT NULL,
    "apikeyId" INTEGER NULL DEFAULT NULL,
    "filename" VARCHAR(32) NULL DEFAULT NULL,
    PRIMARY KEY ("id")
  );

CREATE TABLE
  "settings" (
    "key" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL DEFAULT '',
    PRIMARY KEY ("key")
  );

CREATE TABLE
  "user" (
    "id" INTEGER NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "passhash" VARCHAR(128) NOT NULL DEFAULT '',
    PRIMARY KEY ("id")
  )