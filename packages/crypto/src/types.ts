export interface TxSecureRecord {
  id: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  wrappedKey: string;
  createdAt: string;
}