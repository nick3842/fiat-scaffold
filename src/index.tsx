#!/usr/bin/env bun

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App, type DeferredHook } from "./app.tsx";
import { hookRegistry } from "./hooks/index.ts";

export interface CliOptions {
  hook?: string;
  hookIsFile?: boolean;
  help?: boolean;
  listHooks?: boolean;
}

function isFilePath(value: string): boolean {
  return value.includes("/") || value.endsWith(".sh");
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--hook" || arg === "-h") {
      const value = args[++i];
      if (value) {
        options.hook = value;
        options.hookIsFile = isFilePath(value);
      }
    } else if (arg === "--help") {
      options.help = true;
    } else if (arg === "--list-hooks" || arg === "-l") {
      options.listHooks = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
fiat - Full-stack TypeScript project generator

Usage: fiat [options]

Options:
  --hook, -h <id|path>    Run a built-in hook or custom script after generation
  --list-hooks, -l        List available built-in hooks
  --help                  Show this help message

Environment variables available in hooks/scripts:
  SCAFFOLD_PROJECT_NAME   Name of the generated project
  SCAFFOLD_PROJECT_PATH   Absolute path to the project root
  SCAFFOLD_FRONTEND_PATH  Absolute path to the frontend directory
  SCAFFOLD_BACKEND_PATH   Absolute path to the backend directory

Examples:
  fiat                            # Interactive wizard
  fiat --hook tmux-dev            # Generate and open in tmux session
  fiat --hook ./my-script.sh      # Run custom script after generation
  fiat -h /path/to/setup.sh       # Run custom script (absolute path)
`);
}

function listHooks() {
  const hooks = hookRegistry.getAll();
  console.log("\nAvailable hooks:\n");
  for (const hook of hooks) {
    console.log(`  ${hook.id}`);
    console.log(`    ${hook.description}\n`);
  }
}

// Use Bun's native file writing for synchronous terminal reset
function resetTerminalSync(keepStdinAlive = false) {
  const reset = [
    "\x1b[?1000l", // Disable X11 mouse reporting
    "\x1b[?1002l", // Disable cell motion mouse tracking  
    "\x1b[?1003l", // Disable all motion mouse tracking
    "\x1b[?1005l", // Disable UTF-8 mouse mode
    "\x1b[?1006l", // Disable SGR mouse mode
    "\x1b[?1015l", // Disable URXVT mouse mode
    "\x1b[?1049l", // Exit alternate screen buffer
    "\x1b[?25h", // Show cursor
    "\x1b[0m", // Reset all attributes
  ].join("");

  // Restore stdin to cooked mode
  if (process.stdin.isTTY) {
    try {
      process.stdin.setRawMode(false);
      if (!keepStdinAlive) {
        process.stdin.pause();
        process.stdin.unref();
      }
    } catch {
      // Ignore
    }
  }

  // Synchronous write using Bun
  Bun.write(Bun.stdout, reset);
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.listHooks) {
    listHooks();
    process.exit(0);
  }

  const renderer = await createCliRenderer({
    useAlternateScreen: true,
  });

  const root = createRoot(renderer);

  let isCleaningUp = false;

  const cleanup = async (exitCode = 0, deferredHook?: DeferredHook) => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    // Reset terminal FIRST before unmounting
    // Keep stdin alive if we have a deferred hook that needs terminal access
    resetTerminalSync(!!deferredHook);

    try {
      root.unmount();
      renderer.stop();
    } catch {
      // Ignore errors during cleanup
    }

    // If there's a deferred hook (like tmux), run it after TUI cleanup
    if (deferredHook) {
      const result = await hookRegistry.execute(deferredHook.hookId, deferredHook.ctx);
      if (!result.success) {
        console.error(`Hook failed: ${result.error}`);
        process.exit(1);
      }
      // Exit after hook completes (for switch-client case) or if exec failed
      process.exit(0);
    }

    process.exit(exitCode);
  };

  // Handle process signals
  process.on("SIGINT", () => cleanup(0));
  process.on("SIGTERM", () => cleanup(0));

  root.render(<App onExit={cleanup} cliOptions={options} />);
}

main().catch((err) => {
  resetTerminalSync();
  console.error("Failed to start scaffold:", err);
  process.exit(1);
});
