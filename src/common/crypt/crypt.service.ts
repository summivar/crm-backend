import * as crypto from 'crypto';

export class CryptService {
  private static readonly secretKey = 'your_secret_key';

  static encrypt(id: number, role: string): string {
    const data = `${id}:${role}`;
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(this.secretKey, 'salt', 100000, 32, 'sha512');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }

  static decrypt(encryptedString: string): { id: number; role: string } {
    const iv = Buffer.from(encryptedString.slice(0, 32), 'hex');
    const encryptedData = encryptedString.slice(32);
    const key = crypto.pbkdf2Sync(this.secretKey, 'salt', 100000, 32, 'sha512');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    const [id, role] = decrypted.split(':');
    return {id: Number(id), role};
  }
}
