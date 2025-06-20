import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { sql } from "../../hooks.server";
import { getSetting } from "$lib/settings";
import { writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";
import { Setting } from "$lib/types";
import dayjs from "dayjs";
import { attachmentDir } from "$lib/var";

const schema = {
  body: z.object({
    type: z.string().max(32),
    message: z.string().max(128),
    user: z.string().max(32).optional(),
    machine: z.string().max(32).optional(),
    file: z.any().optional(),
    apikey: z.union([z.string(), z.null()]).optional().default(null),
  })
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.formData()
    const obj: { [key: string]: string } = {}
    data.forEach((v, k) => {
      obj[k] = v.toString()
    })
    const body = schema.body.parse(obj);
    let apikeyId: number | null = null
    let filename: string = '';

    // WE GOTTA FIX SOMETHING HERE
    if (await getSetting(Setting.KeyRequired) === true) {
      if (body.apikey === null) error(400, "API key required");
    }

    if (body.apikey !== null) {
      let apikey = sql.getOne<{ id: number }>(`SELECT id FROM apikey WHERE code = :apikey`, body)
      if (!apikey) error(400, "Invalid API key");
      apikeyId = apikey.id
    }

    if (body.file) {
      try {
        let filename = uuid() + '.log';
        await writeFile(`${attachmentDir}/${filename}`, body.file);
        filename = filename;
      } catch (e) {
        console.log(e);
        error(500, 'Error writing file');
      }
    }

    sql.set(`
      INSERT INTO log (date, type, message, user, machine, filename, apikeyId)
      VALUES (:date, :type, :message, :user, :machine, :filename, :apikeyId)
      `, {
      ...body,
      date: dayjs().toISOString(),
      apikeyId,
      filename,
    })

    return new Response();
  } catch (e) {
    console.log(e);
    throw error(400)
  }
};


