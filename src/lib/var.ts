import { z } from "zod";

export const schemaFile = './src/db/Schema.sql'
export const initDataFile = './src/db/InitData.sql'

const envSchema = z.object({
  DATA_DIR: z.string()
})

const env = envSchema.parse(process.env);

export const dataDir = env.DATA_DIR
export const dbFile = dataDir + "/lumber.sqlite"
export const attachmentDir = dataDir + "/attachments"