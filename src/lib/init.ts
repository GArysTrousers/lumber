import type { Sql } from "./sql";
import bcrypt from "bcryptjs";

export async function checkDB(sql:Sql) {
  console.log("checking database...");
  let res = await sql.get(`SELECT * FROM user`);
  if (res.length === 0) {
    await sql.set(`INSERT INTO user (username, passhash) VALUES (:username, :passhash)`, {
      username: 'lumber',
      passhash: await bcrypt.hash('mill', 8)
    })
    console.log("created initial user");
    
  } else {

  }
  console.log("database check finished");
  
}