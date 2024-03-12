
import type { RequestHandler } from "./$types";
import { sql } from "../../../../hooks.server";
import { removeOldLogs } from "$lib/cleanup";



export const POST: RequestHandler = async () => {
  await removeOldLogs(sql)
  return new Response()
};