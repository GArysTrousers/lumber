import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { readFile, access } from "fs/promises";
import { permission } from "$lib/auth";
import { attachmentDir } from "../../../../hooks.server";


export const POST: RequestHandler = async ({ params, locals }) => {
  
  permission(locals.session);
  let { filename } = params

  try {
    await access(`${attachmentDir}/${filename}`)
  } catch (e) {
    throw error(400, "File doesn't exist")
  }

  try {
    const content = await readFile(`${attachmentDir}/${filename}`, { encoding: 'utf8' })
    return json({ content })
  } catch (e) {
    throw error(500)
  }
};


