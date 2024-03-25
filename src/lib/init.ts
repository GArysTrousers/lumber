import { SettingName, defaultSettings, getSetting } from "./settings";
import { Sql, type Options } from "./sql";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import mysql from 'mysql2/promise'

export async function checkDB(opt: Options) {
  console.log("checking database...");

  // Setup database tables
  const sqlConnection = await mysql.createConnection({
    host: opt.host,
    user: opt.user,
    password: opt.password,
    multipleStatements: true,
  })
  
  let dbInitFile = (await readFile('./db.sql')).toString();

  await sqlConnection.query(dbInitFile);
  console.log("database created if not exist");

  // Setup database settings
  const sql = new Sql(opt)
  
  let res = await sql.get(`SELECT * FROM user`);
  if (res.length === 0) {
    await sql.set(`INSERT INTO user (username, passhash) VALUES (:username, :passhash)`, {
      username: 'lumber',
      passhash: await bcrypt.hash('mill', 8)
    })
    console.log("created initial user");
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    try {
      await getSetting(SettingName.parse(key))
    } catch (error) {
      await sql.set(`
      INSERT INTO settings (\`key\`, value) 
      VALUES (:key, :value)`,
        { key, value: JSON.stringify(value) })
    }
  }

  console.log("database check finished");
}