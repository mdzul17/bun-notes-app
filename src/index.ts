import { Elysia } from "elysia";
import { configureNotesRoutes } from "./routes/NotesRoute";
import { configureUsersRoutes } from "./routes/UsersRoute";
import { configureAuthenticationsRoutes } from "./routes/AuthenticationsRoute";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie"

const app = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET,
    exp: '7d'
  }))
  .use(cookie())
  .use(swagger({
    path: "/v1/swagger"
  }));

app
  .get("/", () => `Welcome to Bun Elysia`)
  .group("/notes", configureNotesRoutes)
  .group("/users", configureUsersRoutes)
  .group("/authentications", configureAuthenticationsRoutes)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);