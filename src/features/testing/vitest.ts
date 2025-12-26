import type { FeatureModule } from "../types.ts";
import type { ScaffoldConfig } from "../../core/config.ts";

export const vitestFeature: FeatureModule = {
  id: "testing",
  displayName: "Vitest",
  description: "Testing framework with Vitest",
  affects: ["frontend", "backend"],

  dependencies: {},

  devDependencies: {
    frontend: {
      vitest: "^2.1.0",
      "@testing-library/react": "^16.0.0",
      "@testing-library/dom": "^10.0.0",
      jsdom: "^25.0.0",
    },
    backend: {
      vitest: "^2.1.0",
    },
  },

  scripts: {
    frontend: {
      test: "vitest",
      "test:run": "vitest run",
    },
    backend: {
      test: "vitest",
      "test:run": "vitest run",
    },
  },

  getTemplateVariables(_config: ScaffoldConfig) {
    return {
      testingEnabled: true,
    };
  },
};
