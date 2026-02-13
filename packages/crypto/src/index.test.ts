import { describe, it, expect } from 'vitest';
import { encryptPayload, decryptPayload } from './index';
import { randomBytes } from 'crypto';

const DUMMY_MASTER_KEY = randomBytes(32).toString('hex');

describe('Crypto Library Compliance', () => {
  const dummyPartyId = 'party_test';
  const dummyPayload = { amount: 500, currency: 'USD' };

  it('1. should encrypt and decrypt correctly', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    // Verify Data Model Structure
    expect(record.payload_nonce).toHaveLength(24); // 12 bytes
    expect(record.payload_tag).toHaveLength(32);   // 16 bytes
    expect(record.alg).toBe("AES-256-GCM");

    const decrypted = decryptPayload(record, DUMMY_MASTER_KEY);
    expect(decrypted).toEqual(dummyPayload);
  });

  it('2. should reject tampered ciphertext', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    const tampered = { ...record };
    // Change last char of ciphertext
    tampered.payload_ct = tampered.payload_ct.slice(0, -1) + (tampered.payload_ct.slice(-1) === 'a' ? 'b' : 'a');

    expect(() => decryptPayload(tampered, DUMMY_MASTER_KEY)).toThrow(/Tampering/);
  });

  it('3. should reject tampered tag', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    const tampered = { ...record };
    // Set invalid tag
    tampered.payload_tag = '00000000000000000000000000000000';

    expect(() => decryptPayload(tampered, DUMMY_MASTER_KEY)).toThrow(/Tampering/);
  });

  it('4. should reject invalid nonce length', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    const tampered = { ...record };
    tampered.payload_nonce = '00'; // Too short (not 12 bytes)

    expect(() => decryptPayload(tampered, DUMMY_MASTER_KEY)).toThrow(/Invalid payload_nonce length/);
  });

  it('5. should reject invalid hex', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload, DUMMY_MASTER_KEY);
    
    const tampered = { ...record };
    tampered.payload_ct = 'ZZZZZZ'; // Z is not hex

    expect(() => decryptPayload(tampered, DUMMY_MASTER_KEY)).toThrow(/Invalid hex/);
  });
});