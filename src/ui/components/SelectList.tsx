export interface SelectOption {
  label: string;
  description: string;
  value: string;
  disabled?: boolean;
}

interface SelectListProps {
  options: SelectOption[];
  selectedIndex: number;
}

export function SelectList({ options, selectedIndex }: SelectListProps) {
  return (
    <box flexDirection="column">
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const color = option.disabled ? "#808080" : isSelected ? "#00ffff" : undefined;

        return (
          <box key={option.value}>
            <text fg={color}>
              {isSelected ? "❯ " : "  "}
              {option.label}
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
