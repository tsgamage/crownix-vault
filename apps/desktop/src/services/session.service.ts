import { DatabaseService } from "./db.service";

export class SessionService {
  private static key: CryptoKey | null = null;

  static setKey(key: CryptoKey) {
    this.key = key;
  }

  static getKey(): CryptoKey {
    if (!this.key) {
      throw new Error("Vault is locked");
    }
    return this.key;
  }

  static isUnlocked(): boolean {
    return this.key !== null;
  }

  static lock() {
    this.key = null;
    DatabaseService.destroy();
  }
}
