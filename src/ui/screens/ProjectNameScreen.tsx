import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Header } from "../components/Header.tsx";
import { StepIndicator } from "../components/StepIndicator.tsx";
import { useWizard } from "../hooks/useWizard.tsx";

interface ProjectNameScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProjectNameScreen({ onNext, onBack }: ProjectNameScreenProps) {
  const { config, setProjectName } = useWizard();
  const [name, setName] = useState(config.projectName || "my-app");
  const [error, setError] = useState<string | null>(null);

  useKeyboard((key) => {
    if (key.name === "return") {
      if (!name.trim()) {
        setError("Project name cannot be empty");
        return;
      }
      if (!/^[a-z0-9-]+$/.test(name)) {
        setError("Project name can only contain lowercase letters, numbers, and hyphens");
        return;
      }
      setProjectName(name);
      onNext();
    } else if (key.name === "escape") {
      onBack();
    } else if (key.name === "backspace") {
      setName((prev) => prev.slice(0, -1));
      setError(null);
    } else if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta) {
      setName((prev) => prev + key.sequence);
      setError(null);
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <Header title="Create New Project" />
      <StepIndicator current={1} total={5} label="Project Name" />

      <box marginTop={1} marginBottom={1}>
        <text><b>What is your project name?</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <text fg="#00ffff">❯ </text>
        <text>{name}</text>
        <text fg="#00ffff">█</text>
      </box>

      {error && (
        <box marginTop={1} marginBottom={1}>
          <text fg="#ff0000">{error}</text>
        </box>
      )}

      <box marginTop={2}>
        <text fg="#808080">Enter to continue, Esc to go back</text>
      </box>
    </box>
  );
}
