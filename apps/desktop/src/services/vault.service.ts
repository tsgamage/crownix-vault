import { DatabaseService } from "./db.service";
import type { IPasswordItem } from "../utils/types/global.types";

export class VaultService {
  static loadVault(vault: IPasswordItem[]) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      INSERT INTO vault_items (id, data)
      VALUES (?, ?)
    `);

    for (const item of vault) {
      stmt.run([item.id, JSON.stringify(item)]);
    }

    stmt.free();
  }

  static createItem(item: IPasswordItem) {
    const db = DatabaseService.getDB();
    const stmt = db.prepare(`
      INSERT INTO vault_items (id, data)
      VALUES (?, ?)
    `);
    stmt.run([item.id, JSON.stringify(item)]);
    stmt.free();
  }

  static getAllItems(): IPasswordItem[] {
    const db = DatabaseService.getDB();

    const res = db.exec(`
      SELECT data FROM vault_items
      ORDER BY json_extract(data, '$.title')
    `);

    if (!res.length) return [];

    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  static getItemById(id: string): IPasswordItem | null {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      SELECT data FROM vault_items WHERE id = ?
    `);

    stmt.bind([id]);

    if (!stmt.step()) {
      stmt.free();
      return null;
    }

    const item = JSON.parse(stmt.getAsObject().data as string);
    stmt.free();
    return item;
  }

  static updateItem(item: IPasswordItem) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      UPDATE vault_items
      SET data = ?
      WHERE id = ?
    `);

    stmt.run([
      JSON.stringify({
        ...item,
        updatedAt: Date.now(),
      }),
      item.id,
    ]);

    stmt.free();
  }

  static deleteItem(id: string) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      DELETE FROM vault_items WHERE id = ?
    `);

    stmt.run([id]);
    stmt.free();
  }

  static exportVault() {
    return this.getAllItems();
  }
}
