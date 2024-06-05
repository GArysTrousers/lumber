import { getSetting } from "./settings";
import type { Sql } from "./sql";
import { sqlDate } from "./date-utils";
import { rm } from "fs/promises";
import { Setting } from "./types";
import { attachmentDir } from "../hooks.server";

export async function removeOldLogs(sql: Sql) {
  const maxLogAge = await getSetting(Setting.MaxLogAge);

  const date = sqlDate(Date.now(), -maxLogAge)

  const filenames = (await sql.get(`
    SELECT filename FROM log 
    WHERE date < @date AND filename IS NOT NULL`,
    { date })).map((v) => v.filename)

  await sql.set(`DELETE FROM log WHERE date < @date`, { date })

  for (const filename of filenames) {
    try {
      await rm(`${attachmentDir}/${filename}`)
    } catch (e) {
      console.log(e);
    }
  }
}