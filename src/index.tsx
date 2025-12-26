#!/usr/bin/env bun

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app.tsx";

// Use Bun's native file writing for synchronous terminal reset
function resetTerminalSync() {
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

  // Restore stdin first
  if (process.stdin.isTTY) {
    try {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.unref();
    } catch {
      // Ignore
    }
  }

  // Synchronous write using Bun
  Bun.write(Bun.stdout, reset);
}

async function main() {
  const renderer = await createCliRenderer({
    useAlternateScreen: true,
  });

  const root = createRoot(renderer);

  let isCleaningUp = false;

  const cleanup = () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    // Reset terminal FIRST before unmounting
    resetTerminalSync();

    try {
      root.unmount();
      renderer.stop();
    } catch {
      // Ignore errors during cleanup
    }

    process.exit(0);
  };

  // Handle process signals
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  root.render(<App onExit={cleanup} />);
}

main().catch((err) => {
  resetTerminalSync();
  console.error("Failed to start scaffold:", err);
  process.exit(1);
});
