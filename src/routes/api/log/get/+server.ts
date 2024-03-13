import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { z } from "zod";
import { sqlDate } from "$lib/date-utils";

const schema = {
  body: z.object({
    options: z.object({
      limit: z.number(),
      dateMin: z.string(),
      dateMax: z.string(),
      apikey: z.number(),
    })
  })
}


export const POST: RequestHandler = async ({ request }) => {

  const { options } = schema.body.parse(await request.json())

  options.dateMin = options.dateMin
    ? options.dateMin = sqlDate(options.dateMin)
    : options.dateMin = sqlDate(0);
  options.dateMax = options.dateMax
    ? options.dateMax = sqlDate(options.dateMax, 1)
    : options.dateMax = sqlDate(Date.now(), 1);


  let logs = await sql.get(
    `SELECT * FROM log 
    WHERE date > :dateMin 
    AND date < :dateMax
    ${options.apikey > 0 ? 'AND apikeyId = :apikey ':''}
    ORDER BY date DESC 
    ${options.limit > 0 ? 'LIMIT :limit' : ''}`, body.options)

  logs = logs.map((v) => ({
    ...v,
    searchString: `${v.type}|${v.message}|${v.user}|${v.machine}`.toLowerCase()
  }))

  return json(logs)
};

export interface Log {
  id: number;
  date: string;
  type: string;
  message: string;
  user: string;
  machine: string;
  apikeyId: number;
  filename: string;
  searchString: string;
}