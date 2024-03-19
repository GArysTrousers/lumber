import { checkSettings, setDB } from '$lib/settings';
import { Sql } from '$lib/sql';
import type { Handle } from '@sveltejs/kit';
import { dbHost, dbName, dbUsername,dbPassword } from "$env/static/private";
import { CronJob } from "cron";
import { removeOldLogs } from '$lib/cleanup';
import { SessionManager, RedisProvider } from "mega-session";


export const sql = new Sql({
  host: dbHost,
  database: dbName,
  user: dbUsername,
  password: dbPassword
})

setDB(sql)
await checkSettings()

const cleanupLogsJob = CronJob.from({
  cronTime: '0 0 * * *',
  onTick: async () => {
    await removeOldLogs(sql);
  },
  start: true,
  timeZone: 'system'
});

let sm = new SessionManager(
  new RedisProvider({
    host: 'localhost',
    port: '6379',
    db: '0',
    user: '',
    password: '',
  }), {
  cookieName: "lumber_session_id",
  version: "1",
  timeoutMillis: 1000000,
})
await sm.init()


export const handle: Handle = async ({ event, resolve }) => {
  const [sessionId, session] = await sm.startSession(event.cookies.get(sm.options.cookieName));
  
  event.locals.sessionId = sessionId;
  event.locals.session = session.data;

  let response = await resolve(event);

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