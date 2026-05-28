import { OrderSummary } from "../../../features/pedido/components/OrderSummary";
import type { CartItem } from "../../../features/pedido/types/pedidoTypes";

interface CarrinhoSectionProps {
  cart: CartItem[];
}

export function CarrinhoSection({ cart }: CarrinhoSectionProps) {
  return <OrderSummary cart={cart} />;
}
