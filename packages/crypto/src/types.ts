export interface TxSecureRecord {
  id: string;
  partyId: string;
  createdAt: string;
  
  // Payload Encryption Fields
  payload_nonce: string; // 12 bytes hex
  payload_ct: string;    // Ciphertext
  payload_tag: string;   // 16 bytes hex

  // Key Wrapping Fields
  dek_wrap_nonce: string; // 12 bytes hex
  dek_wrapped: string;    // Encrypted DEK
  dek_wrap_tag: string;   // 16 bytes hex

  // Metadata
  alg: "AES-256-GCM";
  mk_version: number;
}