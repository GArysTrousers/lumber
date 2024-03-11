import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { setSetting } from "$lib/settings";

const schema = {
  body: z.object({
    key: z.string().max(32),
    value: z.any()
  })
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = schema.body.parse(await request.json())
    await setSetting(body.key, body.value)
    return json({})
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

