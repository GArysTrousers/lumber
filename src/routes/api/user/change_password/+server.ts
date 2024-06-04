import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { z } from "zod";
import { permission } from "$lib/auth";
import bcrypt from "bcryptjs";

const schema = {
  body: z.object({
    id: z.number(),
    password: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  const body = schema.body.parse(await request.json())

  const data = {
    id: body.id,
    passhash: await bcrypt.hash(body.password, 8)
  }

  let res = await sql.set(`
  UPDATE user
  SET passhash = @passhash
  WHERE id = @id`, data)

  return json(res)
};

export interface User {
  id: number;
  username: string;
  email: string;
}