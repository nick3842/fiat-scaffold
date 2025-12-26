import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { healthRoutes } from "./routes/health";

const app = new Elysia()
  .use(cors())
  .use(healthRoutes)
  .listen(3001);

console.log(
  `{{projectName}} backend running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
