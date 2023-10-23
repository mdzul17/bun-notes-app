import { Elysia } from "elysia";
import { configureNotesRoutes } from "./routes/NotesRoute";
import { configureUsersRoutes } from "./routes/UsersRoute";
import { configureAuthenticationsRoutes } from "./routes/AuthenticationsRoute";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie"
import { cors } from "@elysiajs/cors"
import { AuthenticationError } from "./exceptions/AuthenticationError";
import { AuthorizationError } from "./exceptions/AuthorizationError";
import { InvariantError } from "./exceptions/InvariantError";
import bearer from "@elysiajs/bearer";

const app = new Elysia({ prefix: '/api/v1' })
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('INVARIANT_ERROR', InvariantError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return error.toString()
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return error.toString()
      case 'INVARIANT_ERROR':
        set.status = 400
        return error.toString()
      case 'NOT_FOUND':
        set.status = 404
        return error.toString()
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return 'Something went wrong'
    }
  })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET,
    exp: '7d'
  }))
  .use(jwt({
    name: 'refreshJwt',
    secret: process.env.JWT_REFRESH
  }))
  .use(cookie())
  .use(cors())
  .use(bearer())
  .use(swagger({
    path: "/swagger"
  }));

app
  .get("/", () => `Welcome to Bun Elysia`)
  .group("/notes", configureNotesRoutes)
  .group("/users", configureUsersRoutes)
  .group("/authentications", configureAuthenticationsRoutes)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);