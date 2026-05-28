import { CircleCheck, RefreshCcw, RotateCcw } from "lucide-react";

import type { OrderResponse } from "../../../features/pedido/types/pedidoTypes";

interface StatusPedidoSectionProps {
  busy: boolean;
  order: OrderResponse;
  onRefresh: () => void;
  onRestart: () => void;
}

export function StatusPedidoSection({
  busy,
  order,
  onRefresh,
  onRestart,
}: StatusPedidoSectionProps) {
  return (
    <section className="status-layout">
      <div className={`status-panel ${statusTone(order.status)}`}>
        <CircleCheck aria-hidden="true" />
        <p className="status-label">{order.pedidoId}</p>
        <h2>{order.status.replaceAll("_", " ")}</h2>
        <p>{order.mensagem}</p>
      </div>

      <div className="status-actions">
        <button className="secondary-command" disabled={busy} onClick={onRefresh} type="button">
          <RefreshCcw aria-hidden="true" />
          {busy ? "Atualizando..." : "Atualizar status"}
        </button>
        <button className="primary-command" onClick={onRestart} type="button">
          <RotateCcw aria-hidden="true" />
          Novo pedido
        </button>
      </div>
    </section>
  );
}

function statusTone(status: string) {
  if (status === "CONFIRMADO") {
    return "success";
  }
  if (status === "PAGAMENTO_NEGADO") {
    return "warning";
  }
  return "neutral";
}
