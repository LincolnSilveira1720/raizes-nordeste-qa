import type { Product } from "../../cardapio/types/cardapioTypes";
import type { PaymentScenario } from "../../pagamento/types/pagamentoTypes";

export type OrderStep = "units" | "menu" | "review" | "status";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerForm {
  nome: string;
  telefone: string;
  aceiteComunicacao: boolean;
}

export interface CreateOrderRequest {
  unidadeId: string;
  cliente: {
    nome: string | null;
    telefone: string | null;
    aceiteComunicacao: boolean;
  };
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
  pagamento: {
    cenario: PaymentScenario;
  };
  idempotencyKey: string;
}

export interface OrderResponse {
  pedidoId: string;
  status: string;
  valorTotal: number;
  mensagem: string;
  unidadeId?: string;
}

export interface OrderStatusResponse {
  pedidoId: string;
  status: string;
  mensagem: string;
  ultimaAtualizacao: string;
}
