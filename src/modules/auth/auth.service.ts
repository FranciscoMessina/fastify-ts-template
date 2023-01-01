import { preValidationAsyncHookHandler } from 'fastify';

export const isAuthenticated: preValidationAsyncHookHandler = async (req, reply) => {
  if (req.session.user) {
    console.log('hello');

    req.user = req.session.user;
  } else {
    return reply.unauthorized('You must be logged in to access this resource');
  }
};
