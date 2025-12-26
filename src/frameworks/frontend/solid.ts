import type { FrameworkAdapter } from "../types.ts";
import type { ScaffoldConfig } from "../../core/config.ts";

export const solidAdapter: FrameworkAdapter = {
  id: "solid",
  displayName: "SolidJS",
  description: "SolidJS with Vite, Tailwind CSS v4, TanStack Query (Coming Soon)",
  type: "frontend",
  templateDir: "frontend/solid",
  available: false, // Coming soon

  dependencies: {
    "solid-js": "^1.9.0",
    "@tanstack/solid-query": "^5.90.0",
  },

  devDependencies: {
    "vite-plugin-solid": "^2.11.0",
    vite: "^6.0.0",
    typescript: "^5.7.0",
    tailwindcss: "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
  },

  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
  },

  getTemplateVariables(config: ScaffoldConfig) {
    return {
      projectName: config.projectName,
      hasAuth: config.features.some((f) => f.name === "auth" && f.enabled),
      hasTesting: config.features.some((f) => f.name === "testing" && f.enabled),
    };
  },
};
