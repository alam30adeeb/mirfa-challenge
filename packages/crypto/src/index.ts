import { randomBytes, createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'crypto';

// Define the shape of our encrypted record
export interface TxSecureRecord {
  id: string; // The specific Party ID
  ciphertext: string;
  iv: string;
  authTag: string;
  wrappedKey: string; // The DEK encrypted with the Master Key
  createdAt: string;
}

// --- ENCRYPT FUNCTION ---
// NOW ACCEPTS 3 ARGUMENTS: partyId, payload, and the masterKey
export const encryptPayload = (
  partyId: string, 
  payload: any, 
  masterKeyHex: string // <--- ADDED THIS
): TxSecureRecord => {
  if (!masterKeyHex) throw new Error('Master Key is required for encryption');

  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // 1. Generate a unique DEK (Data Encryption Key) for THIS transaction
  const dek = randomBytes(32); 

  // 2. Encrypt the Payload using the DEK
  const iv = randomBytes(12); // GCM standard IV size
  const cipher = createCipheriv('aes-256-gcm', dek, iv);
  
  const payloadString = JSON.stringify(payload);
  let ciphertext = cipher.update(payloadString, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // 3. Encrypt the DEK using the Master Key (Key Wrapping)
  // We use a simple XOR or separate AES encryption for the key. 
  // For industry standard, we'll use a fresh AES-256-ECB or GCM to wrap the key.
  // Here, we will use a simple IV-based encryption for the key to keep it robust.
  const keyIv = randomBytes(12);
  const keyCipher = createCipheriv('aes-256-gcm', masterKey, keyIv);
  let wrappedKey = keyCipher.update(dek.toString('hex'), 'utf8', 'hex');
  wrappedKey += keyCipher.final('hex');
  const keyAuthTag = keyCipher.getAuthTag().toString('hex');

  // Combine wrapped key components for storage (simplified for this demo)
  // Format: keyIv:keyAuthTag:wrappedKey
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

// --- DECRYPT FUNCTION ---
// NOW ACCEPTS 2 ARGUMENTS: record and the masterKey
export const decryptPayload = (
  record: TxSecureRecord, 
  masterKeyHex: string // <--- ADDED THIS
): any => {
  if (!masterKeyHex) throw new Error('Master Key is required for decryption');
  
  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // 1. Unwrap the DEK
  const [keyIvHex, keyAuthTagHex, wrappedKeyHex] = record.wrappedKey.split(':');
  
  const keyDecipher = createDecipheriv('aes-256-gcm', masterKey, Buffer.from(keyIvHex, 'hex'));
  keyDecipher.setAuthTag(Buffer.from(keyAuthTagHex, 'hex'));
  
  let dekHex = keyDecipher.update(wrappedKeyHex, 'hex', 'utf8');
  dekHex += keyDecipher.final('utf8');
  const dek = Buffer.from(dekHex, 'hex');

  // 2. Decrypt the Payload using the unwrapped DEK
  const decipher = createDecipheriv('aes-256-gcm', dek, Buffer.from(record.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(record.authTag, 'hex'));

  let decrypted = decipher.update(record.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};