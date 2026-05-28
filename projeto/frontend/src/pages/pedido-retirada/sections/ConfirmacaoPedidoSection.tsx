import { ArrowLeft, CreditCard } from "lucide-react";
import { useState } from "react";

import type { PaymentScenario } from "../../../features/pagamento/types/pagamentoTypes";
import type { CartItem, CustomerForm } from "../../../features/pedido/types/pedidoTypes";
import type { Unit } from "../../../features/unidades/types/unidadeTypes";
import { CarrinhoSection } from "./CarrinhoSection";
import { PrivacidadeSection } from "./PrivacidadeSection";

const scenarios: Array<{ value: PaymentScenario; label: string }> = [
  { value: "APROVADO", label: "Aprovar" },
  { value: "NEGADO", label: "Negar" },
  { value: "FALHA", label: "Falhar" },
];

interface ConfirmacaoPedidoSectionProps {
  busy: boolean;
  cart: CartItem[];
  selectedUnit: Unit;
  onBack: () => void;
  onSubmit: (customer: CustomerForm, scenario: PaymentScenario) => void;
}

export function ConfirmacaoPedidoSection({
  busy,
  cart,
  selectedUnit,
  onBack,
  onSubmit,
}: ConfirmacaoPedidoSectionProps) {
  const [scenario, setScenario] = useState<PaymentScenario>("APROVADO");
  const [customer, setCustomer] = useState<CustomerForm>({
    nome: "",
    telefone: "",
    aceiteComunicacao: false,
  });

  return (
    <section className="flow-grid review-grid">
      <form
        className="review-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(customer, scenario);
        }}
      >
        <div className="page-heading page-heading-inline">
          <button className="text-command" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" />
            Cardapio
          </button>
          <div>
            <h2>Revisao</h2>
            <p>{selectedUnit.nome}</p>
          </div>
        </div>

        <div className="field-grid">
          <label>
            Nome
            <input
              autoComplete="name"
              onChange={(event) =>
                setCustomer((current) => ({ ...current, nome: event.target.value }))
              }
              value={customer.nome}
            />
          </label>
          <label>
            Telefone
            <input
              autoComplete="tel"
              onChange={(event) =>
                setCustomer((current) => ({ ...current, telefone: event.target.value }))
              }
              value={customer.telefone}
            />
          </label>
        </div>

        <PrivacidadeSection
          accepted={customer.aceiteComunicacao}
          onChange={(accepted) =>
            setCustomer((current) => ({
              ...current,
              aceiteComunicacao: accepted,
            }))
          }
        />

        <fieldset className="scenario-field">
          <legend>Pagamento simulado</legend>
          <div className="scenario-switch">
            {scenarios.map((item) => (
              <button
                aria-pressed={scenario === item.value}
                className={scenario === item.value ? "selected" : ""}
                key={item.value}
                onClick={() => setScenario(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button className="primary-command confirm-command" disabled={busy} type="submit">
          <CreditCard aria-hidden="true" />
          {busy ? "Processando..." : "Confirmar pedido"}
        </button>
      </form>

      <CarrinhoSection cart={cart} />
    </section>
  );
}
