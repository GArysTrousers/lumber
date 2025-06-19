import { DatabaseSync } from 'node:sqlite';

export class Sql {

  db: DatabaseSync;

  constructor(file: string) {
    this.db = new DatabaseSync(file)
  }

  get<T = any>(query: string, data: Record<string, any> = {}) {
    const statement = this.db.prepare(query)
    statement.setAllowUnknownNamedParameters(true)
    const res = statement.all(data)
    return res as T[]
  }

  getOne<T = any>(query: string, data: Record<string, any> = {}) {
    const statement = this.db.prepare(query)
    statement.setAllowUnknownNamedParameters(true)
    const res = statement.get(data)
    if (res === undefined) return undefined
    return res as T
  }

  set(query: string, data: any | any[] = {}) {
    const statement = this.db.prepare(query)
    statement.setAllowUnknownNamedParameters(true)
    const res = statement.run(data)
    return res
  }

  run(query: string) {
    this.db.exec(query)
  }
}