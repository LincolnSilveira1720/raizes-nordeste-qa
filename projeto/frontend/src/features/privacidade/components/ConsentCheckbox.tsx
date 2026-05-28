interface ConsentCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, label, onChange }: ConsentCheckboxProps) {
  return (
    <label>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}
