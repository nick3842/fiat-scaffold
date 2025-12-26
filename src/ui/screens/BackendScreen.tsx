import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Header } from "../components/Header.tsx";
import { StepIndicator } from "../components/StepIndicator.tsx";
import { SelectList, type SelectOption } from "../components/SelectList.tsx";
import { useWizard } from "../hooks/useWizard.tsx";
import { frameworkRegistry } from "../../frameworks/index.ts";

interface BackendScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function BackendScreen({ onNext, onBack }: BackendScreenProps) {
  const { setBackend } = useWizard();
  const frameworks = frameworkRegistry.getBackendOptions();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.name === "down" || key.name === "j") {
      setSelectedIndex((prev) => Math.min(frameworks.length - 1, prev + 1));
    } else if (key.name === "return") {
      const selected = frameworks[selectedIndex];
      if (!selected || !selected.available) return;

      setBackend({
        framework: selected.id as "elysia",
        database: "none",
      });
      onNext();
    } else if (key.name === "escape") {
      onBack();
    }
  });

  const options: SelectOption[] = frameworks.map((f) => ({
    label: f.displayName,
    description: f.description,
    value: f.id,
    disabled: !f.available,
  }));

  return (
    <box flexDirection="column" padding={1}>
      <Header title="Create New Project" />
      <StepIndicator current={3} total={5} label="Backend Framework" />

      <box marginTop={1} marginBottom={1}>
        <text><b>Select Backend Framework</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <SelectList options={options} selectedIndex={selectedIndex} />
      </box>

      <box marginTop={2}>
        <text fg="#808080">↑/↓ Navigate, Enter to select, Esc to go back</text>
      </box>
    </box>
  );
}
