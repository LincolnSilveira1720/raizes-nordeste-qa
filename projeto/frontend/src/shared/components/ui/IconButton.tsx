import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export function IconButton({ icon, label, ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className="icon-button" title={label} type="button" {...props}>
      {icon}
    </button>
  );
}
