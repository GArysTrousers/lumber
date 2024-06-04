import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { getSetting } from "$lib/settings";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    keys: z.array(z.number())
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const body = schema.body.parse(await request.json())

    let settings: { [key: string]: any } = {}
    for (let key of body.keys) {
      settings[key] = await getSetting(key);
    }
    return json(settings)

  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

