import mysql from 'mysql2'
import type { Pool, ResultSetHeader } from 'mysql2'

interface Options {
  host: string;
  user: string;
  password: string;
  database: string;
}

export class Sql {

  options: Options;
  namedPool: Pool;
  unnamedPool: Pool;

  constructor(options: Options) {
    this.options = options;
    this.namedPool = this.createPool(true)
    this.unnamedPool = this.createPool(false)
  }

  createPool(named: boolean) {
    return mysql.createPool({
      host: this.options.host,
      user: this.options.user,
      password: this.options.password,
      database: this.options.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: named,
    })
  }

  async get<T = any>(query: string, data: Record<string, any> | any[] = {}) {
    try {
      const con = Array.isArray(data)
        ? this.unnamedPool.promise()
        : this.namedPool.promise()
      const res = await con.execute(query, data)
      return res[0] as T[]
    }
    catch (e) {
      console.log(e);
      throw e
    }
  }

  async getOne<T = any>(query: string, data: Record<string, any> | any[] = {}) {
    try {
      const con = Array.isArray(data)
        ? this.unnamedPool.promise()
        : this.namedPool.promise()
      const res = await con.execute(query, data)
      if (Array.isArray(res[0]) && res[0].length > 0)
        return res[0][0] as T
      else
        throw new Error("No Results")
    }
    catch (e) {
      console.log(e);
      throw e
    }
  }

  async set(query: string, data: any | any[] = {}) {
    try {
      const con = Array.isArray(data)
        ? this.unnamedPool.promise()
        : this.namedPool.promise()
      const res = await con.execute(query, data)
      return res[0] as ResultSetHeader
    }
    catch (e) {
      console.log(e);
      throw e
    }
  }
}