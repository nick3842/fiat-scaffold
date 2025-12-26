import { useState, useEffect } from "react";
import { Header } from "../components/Header.tsx";
import { StepIndicator } from "../components/StepIndicator.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx";
import { useWizard } from "../hooks/useWizard.tsx";
import { ProjectGenerator, type GenerationProgress } from "../../core/generator.ts";
import { join, dirname } from "path";

interface GeneratingScreenProps {
  onComplete: () => void;
  onError: (error: Error) => void;
}

interface Step {
  label: string;
  done: boolean;
}

export function GeneratingScreen({ onComplete, onError }: GeneratingScreenProps) {
  const { getFullConfig } = useWizard();
  const [progress, setProgress] = useState<GenerationProgress>({
    phase: "setup",
    message: "Starting...",
    progress: 0,
  });
  const [steps, setSteps] = useState<Step[]>([
    { label: "Creating project structure", done: false },
    { label: "Generating frontend", done: false },
    { label: "Generating backend", done: false },
    { label: "Applying features", done: false },
    { label: "Finalizing project", done: false },
  ]);

  useEffect(() => {
    const generate = async () => {
      try {
        const config = getFullConfig();

        // Get the templates root path
        const templatesRoot = join(dirname(import.meta.url.replace("file://", "")), "..", "..", "templates");

        const generator = new ProjectGenerator(templatesRoot);

        await generator.generate(config, (p) => {
          setProgress(p);

          setSteps((prev) => {
            const newSteps: Step[] = [...prev];
            const phaseIndex = ["setup", "frontend", "backend", "features", "finalize"].indexOf(p.phase);
            for (let i = 0; i < phaseIndex; i++) {
              const step = newSteps[i];
              if (step) {
                newSteps[i] = { label: step.label, done: true };
              }
            }
            return newSteps;
          });
        });

        setSteps((prev) => prev.map((s) => ({ label: s.label, done: true })));
        setTimeout(onComplete, 500);
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    generate();
  }, []);

  const config = getFullConfig();

  return (
    <box flexDirection="column" padding={1}>
      <Header title="Create New Project" />
      <StepIndicator current={5} total={5} label="Generating" />

      <box marginTop={1} marginBottom={1}>
        <text><b>Creating {config.projectName}...</b></text>
      </box>

      <box marginTop={1} marginBottom={1}>
        <ProgressBar progress={progress.progress} message={progress.message} />
      </box>

      <box flexDirection="column" marginTop={1} marginBottom={1}>
        {steps.map((step, index) => (
          <box key={index}>
            <text fg={step.done ? "#00ff00" : "#808080"}>
              {step.done ? "✓" : "○"} {step.label}
            </text>
          </box>
        ))}
      </box>
    </box>
  );
}
