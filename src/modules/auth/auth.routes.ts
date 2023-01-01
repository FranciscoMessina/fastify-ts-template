import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { FastifyPluginAsync } from 'fastify';
import { User } from '../../entities/user.entity';
import { hashPassword, verifyPasswordHash } from '../../utils/passwords';
import { authResponseSchema, authSchema } from './auth.schemas';
import { isAuthenticated } from './auth.service';

export const authRoutes: FastifyPluginAsync = async (fastify, config) => {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: authSchema,
      response: {
        201: authResponseSchema,
      },
    },
    handler: async (req, reply) => {
      try {
        const user = await fastify.em.create(User, {
          ...req.body,
          password: await hashPassword(req.body.password),
        });

        await fastify.em.flush();

        req.session.set('user', user);

        console.log(user);
        reply.code(201);
        return user;
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          return reply.badRequest('Email is already in use.');
        }

        throw err;
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: authSchema,
      response: {
        200: authResponseSchema,
      },
    },
    handler: async (req, reply) => {
      const dbUser = await fastify.em.findOne(User, { email: req.body.email });

      if (!dbUser) {
        return reply.notFound('No account with provided email.');
      }

      if (await verifyPasswordHash(req.body.password, dbUser?.password)) {
        req.session.set('user', dbUser);

        return dbUser;
      }

      return reply.unauthorized('Invalid credentials, please try again');
    },
  });

  fastify.route({
    method: 'GET',
    url: '/me',
    schema: {
      response: {
        200: authResponseSchema,
      },
    },
    preValidation: isAuthenticated,
    handler: async (req, reply) => {
      const currentUser = req.user;

      if (!currentUser) {
        return reply.unauthorized('You are not logged in.');
      }

      const classUser = fastify.em.create(User, { ...currentUser, password: '' });

      return classUser;
    },
  });

  fastify.route({
    method: 'POST',
    url: '/logout',
    preValidation: isAuthenticated,
    handler: async (req, reply) => {
      if (req.user) {
        await req.session.destroy();
        return reply.code(200).send();
      }

      return reply.code(401).send();
    },
  });

  fastify.route({
    method: 'GET',
    url: '/protected',
    preValidation: isAuthenticated,
    handler: async (req, reply) => {
      return {
        secret: 'data',
      };
    },
  });
};
