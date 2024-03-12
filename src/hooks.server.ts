import { checkSettings, setDB } from '$lib/settings';
import { Sql } from '$lib/sql';
import type { Handle } from '@sveltejs/kit';
import { dbHost, dbName, dbUsername,dbPassword } from "$env/static/private";
import { CronJob } from "cron";
import { removeOldLogs } from '$lib/cleanup';


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


export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};