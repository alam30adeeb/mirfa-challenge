import { randomBytes, createCipheriv } from 'crypto';
import { TxSecureRecord } from './types';

export const encryptPayload = (
  partyId: string, 
  payload: any, 
  masterKeyHex: string
): TxSecureRecord => {
  if (!masterKeyHex) throw new Error('Master Key is required for encryption');

  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // 1. Generate DEK
  const dek = randomBytes(32); 

  // 2. Encrypt Data
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', dek, iv);
  
  let ciphertext = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // 3. Wrap DEK
  const keyIv = randomBytes(12);
  const keyCipher = createCipheriv('aes-256-gcm', masterKey, keyIv);
  
  let wrappedKey = keyCipher.update(dek.toString('hex'), 'utf8', 'hex');
  wrappedKey += keyCipher.final('hex');
  const keyAuthTag = keyCipher.getAuthTag().toString('hex');

  const finalWrappedKey = `${keyIv.toString('hex')}:${keyAuthTag}:${wrappedKey}`;

  return {
    id: partyId,
    ciphertext,
    iv: iv.toString('hex'),
    authTag,
    wrappedKey: finalWrappedKey,
    createdAt: new Date().toISOString(),
  };
};