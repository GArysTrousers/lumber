import { dev } from '$app/environment';
import Database from 'better-sqlite3';

export class Sql {

  db: any;

  constructor(file: string) {
    this.db = new Database(file, dev ? { verbose: console.log } : {})
  }

  async get<T = any>(query: string, data: Record<string, any> | any[] = {}) {
    const res = await this.db.prepare(query).all(data)
    return res as T[]
  }

  async getOne<T = any>(query: string, data: Record<string, any> | any[] = {}) {
    const res = await this.db.prepare(query).all(data)
    if (res.length > 0)
      return res[0] as T
    else
      throw new Error("No Results")
  }

  async set(query: string, data: any | any[] = {}) {
    const res = await this.db.prepare(query).run(data)
    return res
  }
}