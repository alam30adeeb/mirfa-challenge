import { describe, it, expect, beforeAll } from 'vitest';
import { encryptPayload, decryptPayload, TxSecureRecord } from './index';

describe('🔐 Envelope Encryption Engine (AES-256-GCM)', () => {
  const dummyPartyId = 'party_test';
  const dummyPayload = { amount: 500, currency: 'USD', secretMessage: "Hello Mirfa!" };

  // Setup: We must provide a fake Master Key before the tests run
  beforeAll(() => {
    process.env.MASTER_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  });

  it('1. Should successfully encrypt and decrypt a payload', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload);
    
    // We mock the 'id' and 'createdAt' since the API usually adds those, not the crypto package
    const fullRecord: TxSecureRecord = { id: 'test_id', createdAt: 'now', ...record };
    
    const decrypted = decryptPayload(fullRecord);
    expect(decrypted).toEqual(dummyPayload);
  });

  it('2. Should fail if the ciphertext is tampered with', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload);
    const fullRecord: TxSecureRecord = { id: 'test_id', createdAt: 'now', ...record };
    
    // Malicious actor changes a single hex character in the encrypted data
    const lastChar = fullRecord.payload_ct.slice(-1);
    const tamperedChar = lastChar === 'a' ? 'b' : 'a'; 
    fullRecord.payload_ct = fullRecord.payload_ct.slice(0, -1) + tamperedChar;

    // Decryption must throw an error because the Auth Tag won't match the new ciphertext
    expect(() => decryptPayload(fullRecord)).toThrow();
  });

  it('3. Should fail if the payload Auth Tag is tampered with', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload);
    const fullRecord: TxSecureRecord = { id: 'test_id', createdAt: 'now', ...record };
    
    // Malicious actor tries to bypass security by injecting a fake tag
    fullRecord.payload_tag = '00000000000000000000000000000000';

    expect(() => decryptPayload(fullRecord)).toThrow();
  });

  it('4. Should fail if the wrapped DEK tag is tampered with', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload);
    const fullRecord: TxSecureRecord = { id: 'test_id', createdAt: 'now', ...record };
    
    // Malicious actor tries to swap the encrypted key (DEK)
    fullRecord.dek_wrap_tag = '00000000000000000000000000000000';

    expect(() => decryptPayload(fullRecord)).toThrow();
  });

  it('5. Should fail if the nonce length is invalid', () => {
    const record = encryptPayload(dummyPartyId, dummyPayload);
    const fullRecord: TxSecureRecord = { id: 'test_id', createdAt: 'now', ...record };
    
    // AES-GCM requires exactly a 12-byte (24 hex characters) nonce. 
    // We truncate it to 8 bytes (16 hex chars)
    fullRecord.payload_nonce = '0000000000000000';

    expect(() => decryptPayload(fullRecord)).toThrow();
  });
});