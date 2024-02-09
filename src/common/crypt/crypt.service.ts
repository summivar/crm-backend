import * as crypto from 'crypto';

export class CryptService {
  static encrypt(id: number, role: string): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from("cryptKey"), "ivKey");
        let encrypted = cipher.update(`${id}:${role}`, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
  }

  static decrypt(encryptedString: string): { id: number; role: string ; } {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from("cryptKey"), "ivKey");
        let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        const [id, role] = decrypted.split(':');
        return { id: Number(id), role };
    }
}
