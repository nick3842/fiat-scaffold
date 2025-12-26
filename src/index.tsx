#!/usr/bin/env bun

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app.tsx";

async function main() {
  const renderer = await createCliRenderer({
    useAlternateScreen: true,
  });

  const root = createRoot(renderer);

  const cleanup = () => {
    root.unmount();
    renderer.stop();
    process.exit(0);
  };

  // Handle process signals
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  root.render(<App onExit={cleanup} />);
}

main().catch((err) => {
  console.error("Failed to start scaffold:", err);
  process.exit(1);
});
