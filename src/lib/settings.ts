import type { Sql } from "./sql";

let sql: Sql

export const settingKeys = [
  "key_required"
]

export function setDB(db: Sql) {
  sql = db;
}

export async function getSetting(key: string) {
  if (!settingKeys.includes(key)) throw new Error("Setting doesn't exist")
  let res = await sql.getOne<{ value: any }>(
    `SELECT value FROM settings WHERE \`key\` = :key`,
    { key })
  return JSON.parse(res.value)
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