import type { IPasswordItem } from "@/utils/types/vault";
import { DatabaseService } from "../db.service";

export class PasswordService {
  static loadPasswordItems(vault: IPasswordItem[]) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      INSERT INTO password_items (id, data)
      VALUES (?, ?)
    `);

    for (const item of vault) {
      stmt.run([item.id, JSON.stringify(item)]);
    }

    stmt.free();
  }

  static createPasswordItem(item: IPasswordItem) {
    const db = DatabaseService.getDB();
    const stmt = db.prepare(`
      INSERT INTO password_items (id, data)
      VALUES (?, ?)
    `);
    stmt.run([item.id, JSON.stringify(item)]);
    stmt.free();
  }

  static getAllPasswordItems(): IPasswordItem[] {
    const db = DatabaseService.getDB();

    const res = db.exec(`
      SELECT data FROM password_items
      ORDER BY json_extract(data, '$.title')
    `);

    if (!res.length) return [];

    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  static getPasswordItemById(id: string): IPasswordItem | null {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      SELECT data FROM password_items WHERE id = ?
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

  static updatePasswordItem(item: IPasswordItem) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      UPDATE password_items
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

  static deletePasswordItem(id: string) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      DELETE FROM password_items WHERE id = ?
    `);

    stmt.run([id]);
    stmt.free();
  }

  static exportPasswordItems() {
    return this.getAllPasswordItems();
  }
}
