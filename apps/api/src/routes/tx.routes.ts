import { FastifyInstance } from 'fastify';
import { encryptController, getTransactionController, decryptController } from '../controllers/tx.controller';

export async function transactionRoutes(fastify: FastifyInstance) {
  // POST /tx/encrypt -> encryptController
  fastify.post('/encrypt', encryptController);

  // GET /tx/:id -> getTransactionController
  fastify.get('/:id', getTransactionController);

  // POST /tx/:id/decrypt -> decryptController
  fastify.post('/:id/decrypt', decryptController);
}