import { error } from "@sveltejs/kit";
import type { Session } from "../app";
import { sql } from "../hooks.server";
import bcrypt from "bcryptjs";

export interface DbUser {
  username: string;
  email: string;
  passhash: string;
}

export interface User {
  username: string;
  email: string;
}

export async function authMySql(username: string, password: string) {
  try {
    let user = await sql.getOne<DbUser>(
      `SELECT * FROM user WHERE username = :username`,
      { username }
    )
    if (user) {
      if (user.passhash == '' || await bcrypt.compare(password, user.passhash)) {
        return {
          username: user.username,
          email: user.email,
        } as User
      }
    }
  } catch (e) { }
  return null;
}

export function permission(session: Session) {
  if (!session.username) throw error(401);
}