import { sql } from "../hooks.server";
import type { Setting } from "./types";

export const defaultSettings = [true, 60]

export async function getSetting(key: Setting) {
  let res = sql.getOne<{ value: string }>(
    `SELECT value FROM settings WHERE \`key\` = @key`,
    { key })
  if (res === undefined) throw new Error("Setting not in DB");
  return JSON.parse(res.value)
}

export async function setSetting(key: Setting, value: any) {
  sql.set(
    `UPDATE settings 
    SET value = :value
    WHERE \`key\` = :key`,
    {
      key: key,
      value: JSON.stringify(value)
    }
  )
}