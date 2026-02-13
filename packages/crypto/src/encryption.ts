import { randomBytes, createCipheriv } from 'crypto';
import { TxSecureRecord } from './types';

export const encryptPayload = (
  partyId: string, 
  payload: any, 
  masterKeyHex: string
): TxSecureRecord => {
  if (!masterKeyHex) throw new Error('Master Key is required for encryption');

  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // 1. Generate DEK (32 bytes)
  const dek = randomBytes(32); 

  // 2. Encrypt Payload (AES-256-GCM)
  const payloadIv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', dek, payloadIv);
  
  let payloadCt = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  payloadCt += cipher.final('hex');
  const payloadTag = cipher.getAuthTag().toString('hex');

  // 3. Wrap DEK (AES-256-GCM)
  const keyIv = randomBytes(12);
  const keyCipher = createCipheriv('aes-256-gcm', masterKey, keyIv);
  
  let dekWrapped = keyCipher.update(dek.toString('hex'), 'utf8', 'hex');
  dekWrapped += keyCipher.final('hex');
  const keyTag = keyCipher.getAuthTag().toString('hex');

  // 4. Return EXACT Data Model
  return {
    id: partyId, // Using partyId as ID for simplicity, or generate a UUID
    partyId,
    createdAt: new Date().toISOString(),
    
    payload_nonce: payloadIv.toString('hex'),
    payload_ct: payloadCt,
    payload_tag: payloadTag,

    dek_wrap_nonce: keyIv.toString('hex'),
    dek_wrapped: dekWrapped,
    dek_wrap_tag: keyTag,

    alg: "AES-256-GCM",
    mk_version: 1
  };
};