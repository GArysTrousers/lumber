import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { setSetting, settingKeys } from "$lib/settings";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    key: z.enum(settingKeys),
    value: z.any()
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const body = schema.body.parse(await request.json())
    await setSetting(body.key, body.value)
    return json({})
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

