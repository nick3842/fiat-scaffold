import { hookRegistry } from "./registry.ts";
import { tmuxDevHook } from "./builtins/tmux-dev.ts";

// Register built-in hooks
hookRegistry.register(tmuxDevHook);

export { hookRegistry };
export type { Hook, HookContext, HookResult } from "./types.ts";
