interface StepIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <box marginBottom={1}>
      <text fg="#808080">
        Step {current}/{total}
        {label && ` - ${label}`}{" "}
      </text>
      {steps.map((step) => (
        <text key={step} fg={step === current ? "#00ffff" : step < current ? "#00ff00" : "#808080"}>
          {step <= current ? "●" : "○"}
          {step < total ? " " : ""}
        </text>
      ))}
    </box>
  );
}
