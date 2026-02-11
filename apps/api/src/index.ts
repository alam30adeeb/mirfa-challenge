import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { encryptPayload, decryptPayload, TxSecureRecord } from '@repo/crypto';
import crypto from 'crypto';

const fastify = Fastify({ logger: true });

// 1. Setup CORS so our Next.js frontend can make requests to this API without security blocks
fastify.register(cors, {
  origin: true // In production, you'd restrict this to your Vercel URL
});

// 2. Our "Database": An in-memory Map
const db = new Map<string, TxSecureRecord>();

// ENDPOINT 1: Encrypt and Save
fastify.post('/tx/encrypt', async (request, reply) => {
  const { partyId, payload } = request.body as any;

  // Basic Validation
  if (!partyId || !payload) {
    return reply.status(400).send({ error: "partyId and payload are required" });
  }

  try {
    // Use our shared crypto package to encrypt
    const encryptedData = encryptPayload(partyId, payload);

    // Generate a unique ID and create the final record
    const id = crypto.randomUUID();
    const record: TxSecureRecord = {
      id,
      createdAt: new Date().toISOString(),
      ...encryptedData
    };

    // Save to our in-memory map
    db.set(id, record);

    return reply.status(201).send(record);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

// ENDPOINT 2: Fetch the encrypted record (No decryption!)
fastify.get('/tx/:id', async (request, reply) => {
  const { id } = request.params as any;
  const record = db.get(id);

  if (!record) {
    return reply.status(404).send({ error: "Record not found" });
  }
  
  return reply.send(record);
});

// ENDPOINT 3: Decrypt the record
fastify.post('/tx/:id/decrypt', async (request, reply) => {
  const { id } = request.params as any;
  const record = db.get(id);

  if (!record) {
    return reply.status(404).send({ error: "Record not found" });
  }

  try {
    // Use our shared crypto package to unwrap the DEK and decrypt the payload
    const originalPayload = decryptPayload(record);
    return reply.send({ originalPayload });
  } catch (error: any) {
    return reply.status(400).send({ error: "Decryption failed or data was tampered with" });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Fastify API running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();