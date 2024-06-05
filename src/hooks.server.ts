
import { Sql } from '$lib/sql';
import { redirect, type Handle } from '@sveltejs/kit';
import { CronJob } from "cron";
import { removeOldLogs } from '$lib/cleanup';
import { SessionManager, InternalProvider } from "mega-session";
import { dataDir } from '$env/static/private';

export const dbFile = dataDir + "/lumber.db"
export const attachmentDir = dataDir + "/attachments"

console.log(dbFile, attachmentDir);

export const sql = new Sql(dbFile)

console.log("hey this is after the sql connect")

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