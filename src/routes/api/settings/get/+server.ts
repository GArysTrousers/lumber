import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { getSetting, settingKeys } from "$lib/settings";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    keys: z.array(z.string())
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const body = schema.body.parse(await request.json())

    let filteredKeys = body.keys.filter((v) => settingKeys.includes(v))
    let settings: { [key: string]: string } = {}
    for (let key of filteredKeys) {
      settings[key] = await getSetting(key);
    }
    return json(settings)

  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

