import { featureRegistry } from "./registry.ts";
import { betterAuthFeature } from "./auth/better-auth.ts";
import { vitestFeature } from "./testing/vitest.ts";

// Register all feature modules
featureRegistry.register(betterAuthFeature);
featureRegistry.register(vitestFeature);

export { featureRegistry };
export type { FeatureModule } from "./types.ts";
