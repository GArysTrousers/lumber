import type { Sql } from "./sql";

let sql: Sql

export const settingKeys = [
  "key_required"
]

export const defaultSettings: {[key:string]: any} = {
  key_required: true
}

export function setDB(db: Sql) {
  sql = db;
}

export async function checkSettings() {
  for (const [key, value] of Object.entries(defaultSettings)) {
    try {
      await getSetting(key)
    } catch (error) {
      await sql.set(`
      INSERT INTO settings (\`key\`, value) 
      VALUES (:key, :value)`,
        { key, value: JSON.stringify(value) })
    }
  }
}

export async function getSetting(key: string) {
  if (!settingKeys.includes(key)) throw new Error("Setting doesn't exist")
  try {
    let res = await sql.getOne<{ value: any }>(
      `SELECT value FROM settings WHERE \`key\` = :key`,
      { key })
    return JSON.parse(res.value)
  } catch (e) {
    throw new Error("Setting not in DB");
  }
}

export async function setSetting(key: string, value: any) {
  if (!settingKeys.includes(key)) throw new Error("Setting doesn't exist")
  await sql.set(
    `UPDATE settings 
    SET value = :value
    WHERE \`key\` = :key`,
    {
      key: key,
      value: JSON.stringify(value)
    }
  )
}