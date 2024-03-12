import { z } from "zod";
import type { Sql } from "./sql";

let sql: Sql

const zSettings = z.enum(["key_required", "max_log_age"])

export type SettingName = "key_required" | "max_log_age"

export const settingKeys = [
  "key_required",
  "max_log_age"
]

export const defaultSettings = {
  key_required: true,
  max_log_age: 60,
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

export async function getSetting(key: SettingName) {
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

export async function setSetting(key: SettingName, value: any) {
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