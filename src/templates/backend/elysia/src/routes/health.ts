import { Elysia } from "elysia";

export const healthRoutes = new Elysia({ prefix: "/api" }).get(
  "/health",
  () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
);
