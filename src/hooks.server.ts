import { checkSettings, setDB } from '$lib/settings';
import { Sql } from '$lib/sql';
import type { Handle } from '@sveltejs/kit';
import { dbHost, dbName, dbUsername,dbPassword } from "$env/static/private";


export const sql = new Sql({
  host: dbHost,
  database: dbName,
  user: dbUsername,
  password: dbPassword
})

setDB(sql)
await checkSettings()

export const handle: Handle = async ({ event, resolve }) => {

  const response = await resolve(event);
  return response;
};