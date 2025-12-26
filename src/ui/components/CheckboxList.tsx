export interface CheckboxOption {
  label: string;
  description: string;
  value: string;
  checked: boolean;
}

interface CheckboxListProps {
  options: CheckboxOption[];
  selectedIndex: number;
}

export function CheckboxList({ options, selectedIndex }: CheckboxListProps) {
  return (
    <box flexDirection="column">
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const color = isSelected ? "#00ffff" : undefined;

        return (
          <box key={option.value}>
            <text fg={color}>
              {isSelected ? "❯ " : "  "}
              {option.checked ? "[✓]" : "[ ]"} {option.label}
            </text>
            {option.description && (
              <text fg="#808080"> - {option.description}</text>
            )}
          </box>
        );
      })}
    </box>
  );
}
