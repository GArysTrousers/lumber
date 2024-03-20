import { sql } from "../hooks.server";
import { compare } from "bcrypt";

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
      if (user.passhash == '' || await compare(password, user.passhash)) {
        return {
          username: user.username,
          email: user.email,
        } as User
      }
    }
  } catch (e) { }
  return null;
}