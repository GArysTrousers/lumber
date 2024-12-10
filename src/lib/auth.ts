import { error } from "@sveltejs/kit";
import { sql } from "../hooks.server";
import bcrypt from "bcryptjs";
import type { AppSession } from "../app";

export interface DbUser {
  username: string;
  email: string;
  passhash: string;
}

export interface User {
  username: string;
  email: string;
}

// export async function authMySql(username: string, password: string) {
//   try {
//     let user = await sql.getOne<DbUser>(
//       `SELECT * FROM user WHERE username = :username`,
//       { username }
//     )
//     if (user) {
//       if (user.passhash == '' || await bcrypt.compare(password, user.passhash)) {
//         return {
//           username: user.username,
//           email: user.email,
//         } as User
//       }
//     }
//   } catch (e) { }
//   return null;
// }

export async function authSqlite(username: string, password: string) {
  try {
    let user = await sql.getOne<DbUser>(
      `SELECT * FROM user WHERE username = @username`,
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

export function permission(session: AppSession) {
  if (!session.data.username) throw error(401);
}