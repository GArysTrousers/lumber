
import { sql } from "../hooks.server";
import type { Setting } from "./types";

export const defaultSettings = [true, 60]

export async function getSetting(key: Setting) {
  try {
    let res = await sql.getOne<{ value: any }>(
      `SELECT value FROM settings WHERE \`key\` = @key`,
      { key })
    return JSON.parse(res.value)
  } catch (e) {
    throw new Error("Setting not in DB");
  }
}

export async function setSetting(key: Setting, value: any) {
  await sql.set(
    `UPDATE settings 
    SET value = @value
    WHERE \`key\` = @key`,
    {
      key: key,
      value: JSON.stringify(value)
    }
  )
}