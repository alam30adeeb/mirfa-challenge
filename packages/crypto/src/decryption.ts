import { createDecipheriv } from 'crypto';
import { TxSecureRecord } from './types';

// Helper to check hex
const isHex = (str: string) => /^[0-9a-fA-F]+$/.test(str);

export const decryptPayload = (
  record: TxSecureRecord, 
  masterKeyHex: string
): any => {
  if (!masterKeyHex) throw new Error('Master Key is required');
  
  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // --- VALIDATION RULES ---
  // 1. Check Nonce Length (12 bytes = 24 hex chars)
  if (record.payload_nonce.length !== 24) throw new Error('Invalid payload_nonce length');
  if (record.dek_wrap_nonce.length !== 24) throw new Error('Invalid dek_wrap_nonce length');

  // 2. Check Tag Length (16 bytes = 32 hex chars)
  if (record.payload_tag.length !== 32) throw new Error('Invalid payload_tag length');
  if (record.dek_wrap_tag.length !== 32) throw new Error('Invalid dek_wrap_tag length');

  // 3. Check Hex Validity
  if (!isHex(record.payload_ct) || !isHex(record.dek_wrapped)) {
    throw new Error('Invalid hex format');
  }

  // --- UNWRAP DEK ---
  const keyDecipher = createDecipheriv('aes-256-gcm', masterKey, Buffer.from(record.dek_wrap_nonce, 'hex'));
  keyDecipher.setAuthTag(Buffer.from(record.dek_wrap_tag, 'hex'));
  
  let dekHex: string;
  try {
    dekHex = keyDecipher.update(record.dek_wrapped, 'hex', 'utf8');
    dekHex += keyDecipher.final('utf8');
  } catch (e) {
    throw new Error('Failed to unwrap DEK (Key Tampering)');
  }
  
  const dek = Buffer.from(dekHex, 'hex');

  // --- DECRYPT PAYLOAD ---
  const decipher = createDecipheriv('aes-256-gcm', dek, Buffer.from(record.payload_nonce, 'hex'));
  decipher.setAuthTag(Buffer.from(record.payload_tag, 'hex'));

  let decrypted: string;
  try {
    decrypted = decipher.update(record.payload_ct, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  } catch (e) {
    throw new Error('Failed to decrypt payload (Ciphertext Tampering)');
  }

  return JSON.parse(decrypted);
};