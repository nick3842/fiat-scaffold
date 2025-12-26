interface ProgressBarProps {
  progress: number; // 0-100
  width?: number;
  message?: string;
}

export function ProgressBar({ progress, width = 30, message }: ProgressBarProps) {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  return (
    <box flexDirection="column">
      <box>
        <text fg="#00ffff">{"█".repeat(filled)}</text>
        <text fg="#808080">{"░".repeat(empty)}</text>
        <text> {progress}%</text>
      </box>
      {message && (
        <text fg="#808080" marginTop={1}>
          {message}
        </text>
      )}
    </box>
  );
}
