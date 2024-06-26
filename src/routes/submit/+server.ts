import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { attachmentDir, sql } from "../../hooks.server";
import { getSetting } from "$lib/settings";
import { writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";
import { Setting } from "$lib/types";
import dayjs from "dayjs";

const schema = {
  body: z.object({
    type: z.string().max(32),
    message: z.string().max(128),
    user: z.optional(z.string().max(32)),
    machine: z.optional(z.string().max(32)),
    file: z.optional(z.any()),
    apikey: z.optional(z.string()),
  })
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.formData()
    const obj: { [key: string]: string } = {}
    data.forEach((v, k) => {
      obj[k] = v.toString()
    })
    const body = {
      user: null,
      machine: null,
      file: null,
      apikey: null,
      apikeyId: null,
      filename: null,
      ...schema.body.parse(obj)
    }

    if (await getSetting(Setting.KeyRequired) === true) {
      if (body.apikey === null) throw error(400, "API key required");
      let apikey = await sql.getOne<{ id: number }>(`SELECT id FROM apikey WHERE code = @apikey`, body)
      if (!apikey) throw error(400, "Invalid API key");
      body.apikeyId = apikey.id
    }
    
    if (body.file) {
      try {
        let filename = uuid() + '.log';
        await writeFile(`${attachmentDir}/${filename}`, body.file);
        body.filename = filename;
      } catch (e) {
        console.log(e);
        
      }
    }

    let res = await sql.set(`
      INSERT INTO log (date, type, message, user, machine, filename, apikeyId)
      VALUES (@date, @type, @message, @user, @machine, @filename, @apikeyId)
      `, {...body, date: dayjs().toISOString()})

    return new Response();
  } catch (e) {
    console.log(e);
    throw error(400)
  }
};


