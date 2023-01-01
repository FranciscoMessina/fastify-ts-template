# Fastify typescript template

Simple template to start projects with Fastify and typescript, includes:

- Docker Compose with Postgres and Redis;
- MikroORM setup with migrations and a very simple User entity just for auth;
- Schema validation and type provider with Zod;
- Basic authentication with "register", "login", "me", and "logout" routes with @fastify/session and redis store;

To use follow this steps:

- Copy the `.env.template` to a `.env` file and replace the default values.
- Make sure you have docker working in your machine.
- Run the `docker-compose.yml` file.
- Install the packages with your preferred package manager. `` `yarn install` or  `npm install` ``
- Run migrations with `npx mikro-orm migrations:up`
- Start the server in dev mode with `npm run dev`
- If there are no errors in the terminal, you now should be able to make a request to `localhost:${PORT}/health` and receive the following response `{ status: "OK" }`
