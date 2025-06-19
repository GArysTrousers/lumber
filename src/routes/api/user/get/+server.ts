import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { permission } from "$lib/auth";


export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);

  let res = sql.get(`
  SELECT id, username, email
  FROM user`)

  return json(res)
};

export interface User {
  id: number;
  username: string;
  email: string;
}