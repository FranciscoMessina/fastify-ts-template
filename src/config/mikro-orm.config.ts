import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { FastifyWithZod } from '../utils/types';
import { Env } from './env';

const MikroOrmConfig = defineConfig({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: Env.POSTGRES_DB,
  password: Env.POSTGRES_PASSWORD,
  host: Env.POSTGRES_HOST,
  port: Env.POSTGRES_PORT,
  user: Env.POSTGRES_USER,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
});

export default MikroOrmConfig;

export async function setupMikroOrm(fastify: FastifyWithZod) {
  const orm = await MikroORM.init<PostgreSqlDriver>(MikroOrmConfig);

  fastify.addHook('onRequest', (req, reply, next) => {
    RequestContext.create(orm.em, next);
  });

  fastify.decorate('orm', orm);
  fastify.decorate('em', orm.em);

  fastify.addHook('onClose', async (app) => {
    await orm.close();
  });

  return orm;
}

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM<PostgreSqlDriver>;
    em: MikroORM<PostgreSqlDriver>['em'];
  }
}
