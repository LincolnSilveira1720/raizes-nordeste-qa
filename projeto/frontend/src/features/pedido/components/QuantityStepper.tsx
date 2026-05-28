import { Minus, Plus } from "lucide-react";

import { IconButton } from "../../../shared/components/ui/IconButton";

interface QuantityStepperProps {
  label: string;
  quantity: number;
  onChange: (quantity: number) => void;
}

export function QuantityStepper({ label, quantity, onChange }: QuantityStepperProps) {
  return (
    <div className="quantity-stepper" aria-label={`Quantidade de ${label}`}>
      <IconButton
        icon={<Minus aria-hidden="true" />}
        label={`Remover ${label}`}
        onClick={() => onChange(quantity - 1)}
      />
      <output>{quantity}</output>
      <IconButton
        icon={<Plus aria-hidden="true" />}
        label={`Adicionar ${label}`}
        onClick={() => onChange(quantity + 1)}
      />
    </div>
  );
}
