import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { dirname, join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const secretPath = join(__dirname, '../data/secret.key');
const algorithm = 'aes-256-gcm';
const ivLength = 16;

const ensureSecretKey = () => {
  if (!existsSync(secretPath)) {
    writeFileSync(secretPath, randomBytes(32));
  }
  return readFileSync(secretPath);
};

export const getSecretKey = (): Buffer => {
  return ensureSecretKey();
};

export const encryptApiKey = (plainText: string): string => {
  const key = getSecretKey();
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
};

export const decryptApiKey = (cipherText: string): string => {
  const key = getSecretKey();
  const data = Buffer.from(cipherText, 'base64');
  const iv = data.slice(0, ivLength);
  const tag = data.slice(ivLength, ivLength + 16);
  const encrypted = data.slice(ivLength + 16);
  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};
