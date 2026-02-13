import { createDecipheriv } from 'crypto';
import { TxSecureRecord } from './types';

export const decryptPayload = (
  record: TxSecureRecord, 
  masterKeyHex: string
): any => {
  if (!masterKeyHex) throw new Error('Master Key is required for decryption');
  
  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // 1. Unwrap DEK
  const [keyIvHex, keyAuthTagHex, wrappedKeyHex] = record.wrappedKey.split(':');
  
  const keyDecipher = createDecipheriv('aes-256-gcm', masterKey, Buffer.from(keyIvHex, 'hex'));
  keyDecipher.setAuthTag(Buffer.from(keyAuthTagHex, 'hex'));
  
  let dekHex = keyDecipher.update(wrappedKeyHex, 'hex', 'utf8');
  dekHex += keyDecipher.final('utf8');
  const dek = Buffer.from(dekHex, 'hex');

  // 2. Decrypt Data
  const decipher = createDecipheriv('aes-256-gcm', dek, Buffer.from(record.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(record.authTag, 'hex'));

  let decrypted = decipher.update(record.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};