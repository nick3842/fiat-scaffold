import { frameworkRegistry } from "./registry.ts";
import { reactAdapter } from "./frontend/react.ts";
import { solidAdapter } from "./frontend/solid.ts";
import { elysiaAdapter } from "./backend/elysia.ts";

// Register all framework adapters
frameworkRegistry.registerFrontend(reactAdapter);
frameworkRegistry.registerFrontend(solidAdapter);
frameworkRegistry.registerBackend(elysiaAdapter);

export { frameworkRegistry };
export type { FrameworkAdapter } from "./types.ts";
