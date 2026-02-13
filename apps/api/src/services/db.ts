import { TxSecureRecord } from '@repo/crypto';

// Singleton: This map lives as long as the server is running
const db = new Map<string, TxSecureRecord>();

export const TransactionService = {
  // Save a record
  save: (id: string, record: TxSecureRecord) => {
    db.set(id, record);
    return record;
  },

  // Find a record
  findById: (id: string): TxSecureRecord | undefined => {
    return db.get(id);
  }
};