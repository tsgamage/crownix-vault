import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "@/assets/db/sql-wasm.wasm?url";

export class DatabaseService {
  private static db: Database | null = null;

  static async init() {
    if (this.db) return this.db;

    const SQL = await initSqlJs({
      locateFile: () => wasmUrl,
    });

    this.db = new SQL.Database(); // :memory:

    this.db.run(`
      CREATE TABLE password_items (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);

    this.db.run(`
      CREATE TABLE password_categories (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);

    return this.db;
  }

  static getDB(): Database {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    return this.db;
  }

  static destroy() {
    this.db?.close();
    this.db = null;
  }
}
