import { setDB } from '$lib/settings';
import { Sql } from '$lib/sql';
import type { Handle } from '@sveltejs/kit';


export const sql = new Sql({
  host: 'localhost',
  database: 'logging',
  user: 'root',
  password: '123456'
})

setDB(sql)

export const handle: Handle = async ({ event, resolve }) => {

  const response = await resolve(event);
  return response;
};