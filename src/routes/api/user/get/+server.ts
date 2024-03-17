import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";


export const POST: RequestHandler = async({ request }) => {

  let res = await sql.get(`
  SELECT id, username, email
  FROM user`)

  return json(res)
};

export interface User {
  id: number;
  username: string;
  email: string;
}