import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Header } from "../components/Header.tsx";
import { StepIndicator } from "../components/StepIndicator.tsx";
import { CheckboxList, type CheckboxOption } from "../components/CheckboxList.tsx";
import { useWizard } from "../hooks/useWizard.tsx";
import { featureRegistry } from "../../features/index.ts";

interface FeaturesScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function FeaturesScreen({ onNext, onBack }: FeaturesScreenProps) {
  const { config, toggleFeature } = useWizard();
  const features = featureRegistry.getAll();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.name === "down" || key.name === "j") {
      setSelectedIndex((prev) => Math.min(features.length - 1, prev + 1));
    } else if (key.name === "space") {
      const selected = features[selectedIndex];
      if (selected) {
        toggleFeature(selected.id);
      }
    } else if (key.name === "return") {
      onNext();
    } else if (key.name === "escape") {
      onBack();
    }
  });

  const options: CheckboxOption[] = features.map((f) => ({
    label: f.displayName,
    description: f.description,
    value: f.id,
    checked: config.features?.some((cf) => cf.name === f.id && cf.enabled) || false,
  }));

  return (
    <box flexDirection="column" padding={1}>
      <Header title="Create New Project" />
      <StepIndicator current={4} total={5} label="Optional Features" />

      <box marginTop={1} marginBottom={1}>
        <text><b>Select Optional Features</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <CheckboxList options={options} selectedIndex={selectedIndex} />
      </box>

      <box marginTop={2}>
        <text fg="#808080">↑/↓ Navigate, Space to toggle, Enter to continue, Esc to go back</text>
      </box>
    </box>
  );
}
