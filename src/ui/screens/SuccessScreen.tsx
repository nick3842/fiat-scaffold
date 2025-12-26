import { useKeyboard } from "@opentui/react";
import { useWizard } from "../hooks/useWizard.tsx";
import type { DeferredHook } from "../../app.tsx";

interface SuccessScreenProps {
  onExit: (exitCode?: number, deferredHook?: DeferredHook) => void;
  hasHook?: boolean;
}

export function SuccessScreen({ onExit, hasHook }: SuccessScreenProps) {
  const { config } = useWizard();

  useKeyboard((key) => {
    if (key.name === "return" || key.name === "escape" || key.sequence) {
      onExit(0);
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <box marginBottom={1}>
        <text fg="#00ff00"><b>✓ Project created successfully!</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <text>Your project has been created at:</text>
      </box>
      <box marginLeft={2} marginBottom={1}>
        <text fg="#00ffff">./{config.projectName}/</text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <text><b>Next steps:</b></text>
      </box>

      <box flexDirection="column" marginLeft={2}>
        <text fg="#808080"># Navigate to your project</text>
        <text fg="#ffff00">cd {config.projectName}</text>
        <text> </text>
        <text fg="#808080"># Start frontend dev server (http://localhost:5173)</text>
        <text fg="#ffff00">cd frontend && bun dev</text>
        <text> </text>
        <text fg="#808080"># Start backend dev server (http://localhost:3001)</text>
        <text fg="#ffff00">cd backend && bun dev</text>
      </box>

      <box marginTop={2}>
        <text fg="#808080">Press any key to exit</text>
      </box>
    </box>
  );
}
