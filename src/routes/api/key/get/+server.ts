import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { permission } from "$lib/auth";


export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);

  let logs = await sql.get(`
  SELECT ak.*, COUNT(log.apikeyId) as count FROM apikey ak
  LEFT JOIN log ON ak.id = log.apikeyId
  GROUP BY ak.id`)

  return json(logs)
};

export interface Key {
  id: number;
  name: string;
  code: string;
  date: string;
  count: number;
}