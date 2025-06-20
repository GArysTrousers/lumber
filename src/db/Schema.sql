CREATE TABLE
  IF NOT EXISTS "apikey" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL DEFAULT ''
  );

CREATE TABLE
  IF NOT EXISTS "log" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "type" TEXT DEFAULT NULL,
    "message" TEXT DEFAULT NULL,
    "user" TEXT DEFAULT NULL,
    "machine" TEXT DEFAULT NULL,
    "apikeyId" INTEGER DEFAULT REFERENCES "apikey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "filename" TEXT DEFAULT NULL
  );

CREATE TABLE
  IF NOT EXISTS "settings" (
    "key" INTEGER NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL DEFAULT ''
  );

CREATE TABLE
  IF NOT EXISTS "user" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passhash" TEXT NOT NULL DEFAULT ''
  );

CREATE TABLE
  IF NOT EXISTS "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL
  );