import { useKeyboard } from "@opentui/react";

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  useKeyboard((key) => {
    if (key.name === "return") {
      onNext();
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <box flexDirection="column" marginBottom={2}>
        <text fg="#00ffff"><b>╔═══════════════════════════════════════╗</b></text>
        <text fg="#00ffff"><b>║                                       ║</b></text>
        <text fg="#00ffff"><b>║        scaffold                       ║</b></text>
        <text fg="#00ffff"><b>║        Full-Stack TypeScript Apps     ║</b></text>
        <text fg="#00ffff"><b>║                                       ║</b></text>
        <text fg="#00ffff"><b>╚═══════════════════════════════════════╝</b></text>
      </box>

      <box marginBottom={1}>
        <text>Create a new full-stack TypeScript application with:</text>
      </box>

      <box flexDirection="column" marginLeft={2} marginBottom={2}>
        <text fg="#00ff00">• React/SolidJS + Vite + Tailwind CSS v4</text>
        <text fg="#00ff00">• TanStack Query for data fetching</text>
        <text fg="#00ff00">• Elysia backend on Bun</text>
        <text fg="#00ff00">• Optional: Better Auth, Vitest</text>
      </box>

      <box marginTop={1}>
        <text fg="#ffff00">Press Enter to start</text>
      </box>
      <box>
        <text fg="#808080">Press Ctrl+C to exit</text>
      </box>
    </box>
  );
}
