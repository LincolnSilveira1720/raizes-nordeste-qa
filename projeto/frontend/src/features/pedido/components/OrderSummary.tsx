import { ShoppingBag } from "lucide-react";

import { cartTotal } from "../utils/cart";
import type { CartItem } from "../types/pedidoTypes";

interface OrderSummaryProps {
  cart: CartItem[];
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <section className="order-summary" aria-label="Resumo do pedido">
      <div className="summary-title">
        <ShoppingBag aria-hidden="true" />
        <h2>Resumo</h2>
      </div>

      <div className="summary-lines">
        {cart.map((item) => (
          <div className="summary-line" key={item.product.id}>
            <span>
              {item.quantity}x {item.product.nome}
            </span>
            <strong>{money(item.product.preco * item.quantity)}</strong>
          </div>
        ))}
      </div>

      <div className="summary-total">
        <span>Total</span>
        <strong>{money(cartTotal(cart))}</strong>
      </div>
    </section>
  );
}

export function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
