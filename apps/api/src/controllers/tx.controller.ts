import { FastifyReply, FastifyRequest } from 'fastify';
import { encryptPayload, decryptPayload } from '@repo/crypto';
import { TransactionService } from '../services/db';

const MASTER_KEY_HEX = process.env.MASTER_KEY_HEX || '';

// 1. Handle Encryption
export const encryptController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { partyId, payload } = req.body as { partyId: string; payload: any };

  if (!partyId || !payload) {
    return reply.status(400).send({ error: 'Missing partyId or payload' });
  }

  try {
    // Logic: Call Crypto Lib
    const record = encryptPayload(partyId, payload, MASTER_KEY_HEX);
    
    // Logic: Save to DB
    TransactionService.save(record.id, record);

    return reply.send(record);
  } catch (error: any) {
    return reply.status(500).send({ error: 'Encryption failed: ' + error.message });
  }
};

// 2. Handle Fetching (Locked)
export const getTransactionController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  
  const record = TransactionService.findById(id);

  if (!record) {
    return reply.status(404).send({ error: 'Transaction not found' });
  }

  return reply.send(record);
};

// 3. Handle Decryption (Unlock)
export const decryptController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  const record = TransactionService.findById(id);

  if (!record) {
    return reply.status(404).send({ error: 'Transaction not found' });
  }

  try {
    // Logic: Decrypt
    const decryptedData = decryptPayload(record, MASTER_KEY_HEX);
    return reply.send({ originalPayload: decryptedData });
  } catch (error: any) {
    // This catches "Auth Tag Mismatch" (Tampering)
    return reply.status(400).send({ error: 'Decryption failed: ' + error.message });
  }
};