import type { IPasswordCategory } from "@/utils/types/vault";
import { DatabaseService } from "../db.service";

export class PasswordCategoryService {
  static loadPasswordCategories(passwordCategories: IPasswordCategory[]) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      INSERT INTO password_categories (id, data)
      VALUES (?, ?)
    `);

    for (const category of passwordCategories) {
      stmt.run([category.id, JSON.stringify(category)]);
    }

    stmt.free();
  }

  static createPasswordCategory(category: IPasswordCategory) {
    const db = DatabaseService.getDB();
    const stmt = db.prepare(`
      INSERT INTO password_categories (id, data)
      VALUES (?, ?)
    `);
    stmt.run([category.id, JSON.stringify(category)]);
    stmt.free();
  }

  static getAllPasswordCategories(): IPasswordCategory[] {
    const db = DatabaseService.getDB();

    const res = db.exec(`
      SELECT data FROM password_categories
      ORDER BY json_extract(data, '$.title')
    `);

    if (!res.length) return [];

    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  static getPasswordCategoryById(id: string): IPasswordCategory | null {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      SELECT data FROM password_categories WHERE id = ?
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

  static updatePasswordCategory(category: IPasswordCategory) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      UPDATE password_categories
      SET data = ?
      WHERE id = ?
    `);

    stmt.run([
      JSON.stringify({
        ...category,
        updatedAt: Date.now(),
      }),
      category.id,
    ]);

    stmt.free();
  }

  static deletePasswordCategory(id: string) {
    const db = DatabaseService.getDB();

    const stmt = db.prepare(`
      DELETE FROM password_categories WHERE id = ?
    `);

    stmt.run([id]);
    stmt.free();
  }

  static exportPasswordCategories() {
    return this.getAllPasswordCategories();
  }
}
