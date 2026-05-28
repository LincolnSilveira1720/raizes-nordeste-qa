import { CircleCheck, CreditCard, MapPinned, ReceiptText } from "lucide-react";

import type { OrderStep } from "../../../features/pedido/types/pedidoTypes";

const steps = [
  { id: "units", label: "Unidade", icon: MapPinned },
  { id: "menu", label: "Cardapio", icon: ReceiptText },
  { id: "review", label: "Revisao", icon: CreditCard },
  { id: "status", label: "Status", icon: CircleCheck },
] as const;

interface FlowRailProps {
  activeStep: OrderStep;
}

export function FlowRail({ activeStep }: FlowRailProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="flow-rail" aria-label="Etapas do pedido">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const state = index < activeIndex ? "done" : step.id === activeStep ? "active" : "";
        return (
          <div className={`flow-step ${state}`} key={step.id}>
            <Icon aria-hidden="true" />
            <span>{step.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
