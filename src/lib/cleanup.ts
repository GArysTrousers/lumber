import { getSetting } from "./settings";
import type { Sql } from "./sql";
import { sqlDate } from "./date-utils";
import { rm } from "fs/promises";
import { logfileDir } from "$env/static/private";

export async function removeOldLogs(sql: Sql) {
  const maxLogAge = await getSetting('max_log_age');

  const date = sqlDate(Date.now(), -maxLogAge)

  const filenames = (await sql.get(`
    SELECT filename FROM log 
    WHERE date < :date AND filename IS NOT NULL`,
    { date })).map((v) => v.filename)

  await sql.get(`DELETE FROM log WHERE date < :date`, { date })

  for (const filename of filenames) {
    try {
      await rm(`${logfileDir}/${filename}`)
    } catch (e) {
      console.log(e);
    }
  }
}