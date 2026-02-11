import * as crypto from 'crypto';

export type TxSecureRecord = {
  id: string;
  partyId: string;
  createdAt: string;
  payload_nonce: string;
  payload_ct: string;
  payload_tag: string;
  dek_wrap_nonce: string;
  dek_wrapped: string;
  dek_wrap_tag: string;
  alg: "AES-256-GCM";
  mk_version: 1;
};

const getMasterKey = (): Buffer => {
  const hexKey = process.env.MASTER_KEY_HEX;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error("CRITICAL: MASTER_KEY_HEX is missing or invalid. Must be a 64-character hex string.");
  }
  return Buffer.from(hexKey, 'hex');
};

export const encryptPayload = (partyId: string, payload: any): Omit<TxSecureRecord, 'id' | 'createdAt'> => {
  const masterKey = getMasterKey();
  const dek = crypto.randomBytes(32);
  const payloadString = JSON.stringify(payload);
  
  const payloadNonce = crypto.randomBytes(12);
  const payloadCipher = crypto.createCipheriv('aes-256-gcm', dek, payloadNonce);
  let payloadCiphertext = payloadCipher.update(payloadString, 'utf8', 'hex');
  payloadCiphertext += payloadCipher.final('hex');
  const payloadTag = payloadCipher.getAuthTag();

  const dekWrapNonce = crypto.randomBytes(12);
  const dekWrapCipher = crypto.createCipheriv('aes-256-gcm', masterKey, dekWrapNonce);
  let dekWrapped = dekWrapCipher.update(dek, undefined, 'hex');
  dekWrapped += dekWrapCipher.final('hex');
  const dekWrapTag = dekWrapCipher.getAuthTag();

  return {
    partyId,
    payload_nonce: payloadNonce.toString('hex'),
    payload_ct: payloadCiphertext,
    payload_tag: payloadTag.toString('hex'),
    dek_wrap_nonce: dekWrapNonce.toString('hex'),
    dek_wrapped: dekWrapped,
    dek_wrap_tag: dekWrapTag.toString('hex'),
    alg: "AES-256-GCM",
    mk_version: 1,
  };
};

export const decryptPayload = (record: TxSecureRecord): any => {
  const masterKey = getMasterKey();
  try {
    const dekWrapDecipher = crypto.createDecipheriv('aes-256-gcm', masterKey, Buffer.from(record.dek_wrap_nonce, 'hex'));
    dekWrapDecipher.setAuthTag(Buffer.from(record.dek_wrap_tag, 'hex'));
    let unwrappedDek = dekWrapDecipher.update(record.dek_wrapped, 'hex');
    const finalDek = dekWrapDecipher.final();
    const dek = Buffer.concat([unwrappedDek, finalDek]);

    const payloadDecipher = crypto.createDecipheriv('aes-256-gcm', dek, Buffer.from(record.payload_nonce, 'hex'));
    payloadDecipher.setAuthTag(Buffer.from(record.payload_tag, 'hex'));
    let decryptedPayload = payloadDecipher.update(record.payload_ct, 'hex', 'utf8');
    decryptedPayload += payloadDecipher.final('utf8');

    return JSON.parse(decryptedPayload);
  } catch (error) {
    throw new Error("Decryption failed. The data or tag may have been tampered with.");
  }
};