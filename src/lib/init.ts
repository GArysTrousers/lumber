import { SettingName, defaultSettings, getSetting } from "./settings";
import { Sql } from "./sql";
import bcrypt from "bcryptjs";
import { dbFile,  } from "$env/static/private";

export async function checkDB() {
  console.log("checking database...");

  // Setup database settings
  const sql = new Sql(dbFile)
  
  let res = await sql.get('SELECT * FROM user');
  
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