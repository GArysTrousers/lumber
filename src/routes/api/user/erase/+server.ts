import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { sql } from "../../../../hooks.server";

const schema = {
  body: z.object({
    username: z.string().max(64)
  })
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = schema.body.parse(await request.json())

    let res = await sql.get(`
      DELETE FROM user 
      WHERE username = :username`,
      body
    )

    return json({})
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

