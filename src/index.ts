import { Elysia } from "elysia";
import { configureNotesRoutes } from "./routes/NotesRoute";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia();

app
  .use(swagger({
    path: "/v1/swagger"
  }))
  .get("/", () => `Welcome to Bun Elysia`)
  .group("/notes", configureNotesRoutes)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);