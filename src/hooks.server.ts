
import { Sql } from '$lib/sql';
import { redirect, type Handle } from '@sveltejs/kit';
import { CronJob } from "cron";
import { removeOldLogs } from '$lib/cleanup';
import { SessionManager } from "mega-session";
import { NodeSqliteProvider } from '$lib/node-sqlite-provider';
import { dbFile } from '$lib/var';
import { building } from '$app/environment';

const cleanupLogsJob = CronJob.from({
  cronTime: '0 0 * * *',
  onTick: async () => {
    await removeOldLogs(sql);
  },
  start: true,
  timeZone: 'system'
});

export const sql = new Sql(building ? ":memory:" : dbFile)

let sm = new SessionManager(
  new NodeSqliteProvider(sql.db), {
  cookieName: "lumber_session_id",
  version: "1",
  timeoutMillis: 1000 * 60 * 60 * 12,
})
await sm.init()

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.session = await sm.startSession(event.cookies.get(sm.options.cookieName));

  let response = await resolve(event);

  if (event.request.method === "GET" && response.status === 401)
    return redirect(301, '/auth')

  response.headers.set('set-cookie', await sm.saveSession(event.locals.session))

  return response;
};