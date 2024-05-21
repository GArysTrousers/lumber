import { checkSettings, setDB } from '$lib/settings';
import { Sql } from '$lib/sql';
import { redirect, type Handle } from '@sveltejs/kit';
import { dbFile,  } from "$env/static/private";
import { CronJob } from "cron";
import { removeOldLogs } from '$lib/cleanup';
import { SessionManager, InternalProvider } from "mega-session";
import { checkDB } from '$lib/init';
import { building } from '$app/environment';
import Database from "better-sqlite3";

// if (building) {
//   await checkDB();
// }

await checkDB()

export const sql = new Sql(dbFile)

// const cleanupLogsJob = CronJob.from({
//   cronTime: '0 0 * * *',
//   onTick: async () => {
//     await removeOldLogs(sql);
//   },
//   start: true,
//   timeZone: 'system'
// });

let sm = new SessionManager(
  new InternalProvider(), {
  cookieName: "lumber_session_id",
  version: "1",
  timeoutMillis: 1000 * 60 * 60 * 12,
})
await sm.init()

// setDB(sql)

export const handle: Handle = async ({ event, resolve }) => {
  const [sessionId, session] = await sm.startSession(event.cookies.get(sm.options.cookieName));
  event.locals.sessionId = sessionId;
  event.locals.session = session.data;

  let response = await resolve(event);

  if (event.request.method === "GET" && response.status === 401)
    return redirect(301, '/auth')

  if (event.locals.sessionId) {
    session.data = event.locals.session
    await sm.saveSession(sessionId, session)
    response.headers.set('set-cookie', sm.freshCookie(sessionId))
  } else {
    await sm.removeSession(sessionId)
    response.headers.set('set-cookie', sm.expiredCookie())
  }

  return response;
};