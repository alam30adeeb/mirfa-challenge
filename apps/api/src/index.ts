import Fastify from 'fastify';
import cors from '@fastify/cors';
import { transactionRoutes } from './routes/tx.routes';

const fastify = Fastify({ logger: true });

async function start() {
  try {
    // 1. Security Plugins
    await fastify.register(cors, { 
      origin: true // Allow all origins (for challenge simplicity)
    });

    // 2. Register Routes (Prefix all with /tx)
    await fastify.register(transactionRoutes, { prefix: '/tx' });

    // 3. Health Check (Optional but good practice)
    fastify.get('/', async () => {
      return { message: '🚀 Mirfa API is live and running on Vercel!' };
    });

    // 4. Start Server
    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();