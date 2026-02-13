import { describe, it, expect } from 'vitest';
import { encryptPayload, decryptPayload, TxSecureRecord } from './index';
import { randomBytes } from 'crypto';

// generate a dummy 32-byte key for testing (hex string)
const DUMMY_MASTER_KEY = randomBytes(32).toString('hex');

describe('Crypto Library', () => {
  const dummyPartyId = 'party_test';
  const dummyPayload = { amount: 500, currency: 'USD' };

  it('should encrypt and decrypt correctly', () => {
    // 1. Encrypt (Now passing the Master Key!)
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);

    expect(record.id).toBe(dummyPartyId);
    expect(record.ciphertext).toBeDefined();
    expect(record.iv).toBeDefined();
    expect(record.authTag).toBeDefined();
    expect(record.wrappedKey).toBeDefined();

    // 2. Decrypt (Now passing the Master Key!)
    const decrypted = decryptPayload(record, DUMMY_MASTER_KEY);

    expect(decrypted).toEqual(dummyPayload);
  });

  it('should throw error if ciphertext is tampered', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    // Tamper with the ciphertext (change the last character)
    const tamperedRecord = { ...record };
    const lastChar = tamperedRecord.ciphertext.slice(-1);
    const newChar = lastChar === 'a' ? 'b' : 'a';
    tamperedRecord.ciphertext = tamperedRecord.ciphertext.slice(0, -1) + newChar;

    expect(() => decryptPayload(tamperedRecord, DUMMY_MASTER_KEY)).toThrow();
  });

  it('should throw error if auth tag is tampered', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);

    // Tamper with the Auth Tag
    const tamperedRecord = { ...record };
    tamperedRecord.authTag = '00000000000000000000000000000000'; // Invalid tag

    expect(() => decryptPayload(tamperedRecord, DUMMY_MASTER_KEY)).toThrow();
  });

  it('should throw error if wrapped key is tampered', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);

    // Tamper with the Wrapped Key string
    const tamperedRecord = { ...record };
    tamperedRecord.wrappedKey = '00000000:00000000:00000000'; // Invalid key format

    expect(() => decryptPayload(tamperedRecord, DUMMY_MASTER_KEY)).toThrow();
  });
});