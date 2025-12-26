interface StepIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  const dots = Array.from({ length: total }, (_, i) => {
    const step = i + 1;
    return step <= current ? "●" : "○";
  }).join(" ");

  return (
    <box flexDirection="row" marginBottom={1}>
      <text fg="#808080">Step {current}/{total}{label ? ` - ${label}` : ""} </text>
      <text fg="#00ffff">{dots}</text>
    </box>
  );
}
