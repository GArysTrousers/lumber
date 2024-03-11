import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";


export const POST: RequestHandler = async({ request }) => {

  let logs = await sql.get(`SELECT * FROM apikey`)

  return json(logs)
};

