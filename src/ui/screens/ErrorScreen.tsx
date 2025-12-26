import { useKeyboard } from "@opentui/react";
import type { DeferredHook } from "../../app.tsx";

interface ErrorScreenProps {
  error: Error;
  onExit: (exitCode?: number, deferredHook?: DeferredHook) => void;
}

export function ErrorScreen({ error, onExit }: ErrorScreenProps) {
  useKeyboard((key) => {
    if (key.name === "return" || key.name === "escape" || key.sequence) {
      onExit(1);
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <box marginBottom={1}>
        <text fg="#ff0000"><b>✗ An error occurred</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <text fg="#ff0000">{error.message}</text>
      </box>

      {error.stack && (
        <box marginTop={1} marginBottom={1} flexDirection="column">
          <text fg="#808080">Stack trace:</text>
          <text fg="#808080">{error.stack.split("\n").slice(1, 5).join("\n")}</text>
        </box>
      )}

      <box marginTop={2}>
        <text fg="#808080">Press any key to exit</text>
      </box>
    </box>
  );
}
