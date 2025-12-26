import type { FeatureModule } from "../types.ts";
import type { ScaffoldConfig } from "../../core/config.ts";

export const betterAuthFeature: FeatureModule = {
  id: "auth",
  displayName: "Better Auth",
  description: "Authentication with Better Auth",
  affects: ["frontend", "backend"],

  dependencies: {
    frontend: {
      "better-auth": "^1.2.0",
    },
    backend: {
      "better-auth": "^1.2.0",
    },
  },

  getTemplateVariables(_config: ScaffoldConfig) {
    return {
      authEnabled: true,
    };
  },
};
