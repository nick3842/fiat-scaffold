import type { FrameworkAdapter } from "../types.ts";
import type { ScaffoldConfig } from "../../core/config.ts";

export const elysiaAdapter: FrameworkAdapter = {
  id: "elysia",
  displayName: "Elysia",
  description: "Bun-first web framework with TypeScript",
  type: "backend",
  templateDir: "backend/elysia",
  available: true,

  dependencies: {
    elysia: "^1.2.0",
    "@elysiajs/cors": "^1.2.0",
  },

  devDependencies: {
    typescript: "^5.7.0",
    "@types/bun": "latest",
  },

  scripts: {
    dev: "bun run --watch src/index.ts",
    start: "bun run src/index.ts",
  },

  getTemplateVariables(config: ScaffoldConfig) {
    return {
      projectName: config.projectName,
      hasAuth: config.features.some((f) => f.name === "auth" && f.enabled),
      hasTesting: config.features.some((f) => f.name === "testing" && f.enabled),
    };
  },
};
