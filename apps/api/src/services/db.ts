import type { TxSecureRecord } from '@repo/crypto';

// Reverting to In-Memory Map for Serverless Stability
// (SQLite is not suitable for Vercel's ephemeral file system)
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