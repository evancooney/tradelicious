

import fastify, { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: true,
});

server.get('/', async (request, reply) => {
  return 'pong\n';
});

server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

const start = async () => {
  try {
    await server.listen({ port: 3456, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();