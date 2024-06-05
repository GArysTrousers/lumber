import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { sql } from "../../../../hooks.server";
import { permission } from "$lib/auth";
import bcrypt from "bcryptjs";

const schema = {
  body: z.object({
    newUser: z.object({
      username: z.string().max(64),
      password: z.string().min(8).max(64),
      email: z.string().max(64),
    })
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  try {
    const { newUser } = schema.body.parse(await request.json())

    const data = {
      username: newUser.username,
      passhash: await bcrypt.hash(newUser.password, await bcrypt.genSalt(8)),
      email: newUser.email
    }
    let res = await sql.get(`
      INSERT INTO user (username, passhash, email) 
      VALUES (@username, @passhash, @email)`,
      data
    )

    return json({})
  } catch (e) {
    console.log(e);
    throw error(400, "Error")
  }
};

