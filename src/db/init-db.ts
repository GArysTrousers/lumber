
import { readFileSync, rmSync, accessSync, mkdirSync } from "node:fs";
import { attachmentDir, dataDir, dbFile, initDataFile, schemaFile } from "../lib/var.ts";
import { DatabaseSync } from "node:sqlite";
import bcryptjs from "bcryptjs";

console.log("init db");


mkdirSync(dataDir, { recursive: true })
mkdirSync(attachmentDir, { recursive: true })

try {
  accessSync(dbFile)
  console.log("deleting old db");
  rmSync(dbFile);
} catch (e) {

}

console.log("creating new db");
const db = new DatabaseSync(dbFile)

console.log("creating tables");
db.exec(readFileSync(schemaFile).toString());
console.log("loading init data");
db.exec(readFileSync(initDataFile).toString());


db.prepare(`
  INSERT INTO user (username, passhash, email) 
  VALUES (:username, :passhash, :email)`)
  .run({
    username: "lumber",
    passhash: await bcryptjs.hash("mill", await bcryptjs.genSalt(8)),
    email: "",
  })

console.log("finished");