import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { readFile, access } from "fs/promises";
import { logfileDir } from "$env/static/private";


export const POST: RequestHandler = async ({ params }) => {
  let { filename } = params

  try {
    await access(`${logfileDir}/${filename}`)
  } catch (e) {
    throw error(400, "File doesn't exist")
  }

  try {
    const content = await readFile(`${logfileDir}/${filename}`, { encoding: 'utf8' })
    return json({ content })
  } catch (e) {
    throw error(500)
  }
};


