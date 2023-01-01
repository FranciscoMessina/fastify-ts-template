import { fastifyCompress } from '@fastify/compress';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifySensible } from '@fastify/sensible';
import { fastifySession } from '@fastify/session';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import connectRedis from 'connect-redis';
import Fastify, { FastifyServerOptions } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import Redis from 'ioredis';
import { ZodError } from 'zod';
import { Env } from './config/env';
import { setupMikroOrm } from './config/mikro-orm.config';
import { authRoutes } from './modules/auth/auth.routes';

const fastifyOptions: FastifyServerOptions = {
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
};

export async function buildApp() {
  const app = Fastify(fastifyOptions)
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler);

  const redisClient = new Redis({
    host: Env.REDIS_HOST,
    port: Env.REDIS_PORT,
    password: Env.REDIS_PASSWORD,
  });
  const RedisStore = connectRedis(fastifySession as any);

  app
    .register(fastifyCompress)
    .register(fastifyCookie)
    .register(fastifySession, {
      secret: Env.SESSION_SECRET,
      store: new RedisStore({ client: redisClient }) as any,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: Env.IS_PROD,
        maxAge: Env.SESSION_MAX_AGE,
      },
    })
    .register(fastifyCors)
    .register(fastifyHelmet)
    .register(fastifySensible);

  app.decorateRequest('user', null);

  await setupMikroOrm(app);

  const prevErrorHandler = app.errorHandler;
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Validation error',
        errors: JSON.parse(error.message),
      });
    }

    if (error instanceof UniqueConstraintViolationException) {
      return reply.badRequest('Attempted to create a unique value that already exists');
    }

    prevErrorHandler(error, request, reply);
  });

  app.get('/health', async () => ({ status: 'OK' }));

  app.register(authRoutes, {
    prefix: 'auth',
  });

  return app;
}
