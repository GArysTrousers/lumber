import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { sql } from "../../../../hooks.server";
import { v4 as uuid } from "uuid";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    name: z.string().max(64),
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const body = schema.body.parse(await request.json())
    const data = {
      name: body.name,
      code: uuid().substring(4, 23)
    }
    let logs = await sql.get(`INSERT INTO apikey (name, code) VALUES (:name, :code)`, data)

    return json(logs)
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

