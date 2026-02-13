import Database from 'better-sqlite3';
import type { TxSecureRecord } from '@repo/crypto';

// 1. Connect to local file (creates 'transaction_storage.db' automatically)
const db = new Database('transaction_storage.db');

// 2. Initialize Table (Run once on startup)
// We use a TEXT column to store the full JSON document
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    partyId TEXT NOT NULL,
    data TEXT NOT NULL, 
    createdAt TEXT NOT NULL
  )
`);

export const TransactionService = {
  // Save a record
  save: (id: string, record: TxSecureRecord) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO transactions (id, partyId, data, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    
    // Store the whole object as a JSON string
    stmt.run(id, record.partyId, JSON.stringify(record), record.createdAt);
    
    return record;
  },

  // Find a record
  findById: (id: string): TxSecureRecord | undefined => {
    const stmt = db.prepare('SELECT data FROM transactions WHERE id = ?');
    const row = stmt.get(id) as { data: string } | undefined;

    if (!row) return undefined;

    // Parse the JSON string back into our Typed Object
    return JSON.parse(row.data) as TxSecureRecord;
  }
};