import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { z } from "zod";
import { permission } from "$lib/auth";

const schema = {
  body: z.object({
    newUser: z.object({
      id: z.number(),
      username: z.string().max(64),
      email: z.string().max(64),
    })
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);
  const body = schema.body.parse(await request.json())

  let res = await sql.set(`
  UPDATE user
  SET username = :username, 
  email = :email
  WHERE id = :id`, body.newUser)

  return json(res)
};

export interface User {
  id: number;
  username: string;
  email: string;
}