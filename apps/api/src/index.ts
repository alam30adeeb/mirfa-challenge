import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { encryptPayload, decryptPayload, TxSecureRecord } from '@repo/crypto';
import crypto from 'crypto';

const fastify = Fastify({ logger: true });

// Setup CORS
fastify.register(cors, { origin: true });

// Our In-Memory Database
const db = new Map<string, TxSecureRecord>();

// 🌟 ADDED: A simple root route to verify the API is online
fastify.get('/', async (request, reply) => {
  return reply.send({ message: "🚀 Mirfa API is live and running on Vercel!" });
});

// ENDPOINT 1: Encrypt and Save
fastify.post('/tx/encrypt', async (request, reply) => {
  const { partyId, payload } = request.body as any;
  if (!partyId || !payload) return reply.status(400).send({ error: "partyId and payload are required" });

  try {
    const encryptedData = encryptPayload(partyId, payload);
    const id = crypto.randomUUID();
    const record: TxSecureRecord = { id, createdAt: new Date().toISOString(), ...encryptedData };
    
    db.set(id, record);
    return reply.status(201).send(record);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

// ENDPOINT 2: Fetch the encrypted record
fastify.get('/tx/:id', async (request, reply) => {
  const { id } = request.params as any;
  const record = db.get(id);
  if (!record) return reply.status(404).send({ error: "Record not found" });
  return reply.send(record);
});

// ENDPOINT 3: Decrypt the record
fastify.post('/tx/:id/decrypt', async (request, reply) => {
  const { id } = request.params as any;
  const record = db.get(id);
  if (!record) return reply.status(404).send({ error: "Record not found" });

  try {
    const originalPayload = decryptPayload(record);
    return reply.send({ originalPayload });
  } catch (error: any) {
    return reply.status(400).send({ error: "Decryption failed or data was tampered with" });
  }
});

// 🌟 VERCEL SERVERLESS FIX: Export the Fastify handler
export default async function handler(req: any, res: any) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}

// Keep local development working (only run .listen if NOT on Vercel)
if (!process.env.VERCEL) {
  fastify.listen({ port: 3001, host: '0.0.0.0' }).then(() => {
    console.log('🚀 Fastify API running locally on http://localhost:3001');
  });
}