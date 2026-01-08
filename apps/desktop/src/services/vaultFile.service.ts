import { appConfig } from "@/utils/constraints";
import { CryptoService } from "./crypto.service";

export class VaultFileService {
  static async createVaultFile(password: string, vaultData: any): Promise<Uint8Array> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await CryptoService.deriveKey(password, salt);

    const { iv, ciphertext } = await CryptoService.encryptJSON(vaultData, key);

    const header = {
      magic: "CROWNIX_VAULT",
      version: appConfig.appVersion,
      salt: CryptoService.bytesToBase64(salt),
      iv: CryptoService.bytesToBase64(iv),
    };

    const headerBytes = new TextEncoder().encode(JSON.stringify(header));

    const buffer = new Uint8Array(4 + headerBytes.length + ciphertext.length);

    const view = new DataView(buffer.buffer);
    view.setUint32(0, headerBytes.length, true);

    buffer.set(headerBytes, 4);
    buffer.set(ciphertext, 4 + headerBytes.length);

    return buffer;
  }

  static async openVaultFile(password: string, fileBytes: Uint8Array) {
    const view = new DataView(fileBytes.buffer);
    const headerLength = view.getUint32(0, true);

    const headerBytes = fileBytes.slice(4, 4 + headerLength);
    const header = JSON.parse(new TextDecoder().decode(headerBytes));

    const encryptedVault = fileBytes.slice(4 + headerLength);

    const key = await CryptoService.deriveKey(password, CryptoService.base64ToBytes(header.salt));

    const vault = await CryptoService.decryptJSON(encryptedVault, CryptoService.base64ToBytes(header.iv), key);

    return { header, vault, key };
  }

  static async buildVaultFileWithKey(
    vaultData: any,
    key: CryptoKey,
    header: {
      salt: string;
      version: number;
    }
  ): Promise<Uint8Array> {
    const { iv, ciphertext } = await CryptoService.encryptJSON(vaultData, key);

    const newHeader = {
      magic: "CROWNIX_VAULT",
      version: header.version,
      salt: header.salt,
      iv: CryptoService.bytesToBase64(iv),
      updatedAt: Date.now(),
    };

    const headerBytes = new TextEncoder().encode(JSON.stringify(newHeader));

    const buffer = new Uint8Array(4 + headerBytes.length + ciphertext.length);

    const view = new DataView(buffer.buffer);
    view.setUint32(0, headerBytes.length, true);

    buffer.set(headerBytes, 4);
    buffer.set(ciphertext, 4 + headerBytes.length);

    return buffer;
  }
}

export interface IVaultFile {
  header: {
    magic: string;
    version: number;
    salt: string;
    iv: string;
  };
  vault: any;
  key: CryptoKey;
}
