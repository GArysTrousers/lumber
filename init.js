import { readFileSync, copyFileSync, mkdirSync } from "node:fs";
import { exit } from "node:process";
import { z } from "zod";

const envSchema = z.object({
  "dataDir": z.string()
})

try {
  let file = readFileSync(".env").toString()

  let dotenvRaw = {}
  file.split(/[\r\n]+/gi).forEach((v) => {
    let data = v.split("=", 2)
    dotenvRaw[data[0]] = data[1]
  })
  let dotenv = envSchema.parse(dotenvRaw)

  mkdirSync(dotenv.dataDir, { recursive: true })
  mkdirSync(dotenv.dataDir + "/attachments", { recursive: true })

  copyFileSync("./default.db", dotenv.dataDir + '/lumber.db')

  console.log("Lumber Initialised Successfully");
} catch (err) {
  console.error("Error:", err.message)
  exit()
}
