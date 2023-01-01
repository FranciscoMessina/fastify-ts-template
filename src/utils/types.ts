import {
  FastifyInstance,
  RawServerDefault,
  FastifyBaseLogger,
  FastifyPluginOptions,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  ContextConfigDefault,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { IncomingMessage, ServerResponse } from 'http';
import { z, ZodTypeAny } from 'zod';
import { User } from '../entities/user.entity';

declare module 'fastify' {
  // Overriding default type provider as to avoid having to manually type Generics in every type;
  interface FastifyTypeProviderDefault {
    output: this['input'] extends ZodTypeAny ? z.infer<this['input']> : never;
  }
  interface Session {
    user?: Omit<User, 'password'>;
  }

  interface FastifyRequest {
    user?: Omit<User, 'password'>;
  }
}
