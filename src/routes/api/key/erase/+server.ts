import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { sql } from "../../../../hooks.server";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    id: z.number(),
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const body = schema.body.parse(await request.json())
    let logs = await sql.get(`DELETE FROM apikey WHERE id = :id`, body)

    return json(logs)
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

