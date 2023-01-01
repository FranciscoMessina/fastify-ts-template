import { buildApp } from './app';
import { Env } from './config/env';

async function main() {
  try {
    const app = await buildApp();

    if (Env.IS_PROD) {
      app.log.info('Running in production mode.');
    }

    await app.listen({
      port: Env.PORT,
      host: '0.0.0.0',
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
