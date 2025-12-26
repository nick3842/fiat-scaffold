import type { FrameworkAdapter } from "../types.ts";
import type { ScaffoldConfig } from "../../core/config.ts";

export const reactAdapter: FrameworkAdapter = {
  id: "react",
  displayName: "React",
  description: "React 19 with Vite, Tailwind CSS v4, TanStack Query",
  type: "frontend",
  templateDir: "frontend/react",
  available: true,

  dependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.90.0",
  },

  devDependencies: {
    "@vitejs/plugin-react": "^4.3.0",
    vite: "^6.0.0",
    typescript: "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    tailwindcss: "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
  },

  scripts: {
    dev: "vite",
    build: "tsc -b && vite build",
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
