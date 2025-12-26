interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <box flexDirection="column" marginBottom={1}>
      <text fg="#00ffff">
        <b>{title}</b>
      </text>
      <text fg="#808080">{"─".repeat(40)}</text>
    </box>
  );
}
