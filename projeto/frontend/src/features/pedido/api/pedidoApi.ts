import { apiRequest } from "../../../services/apiClient";
import type {
  CreateOrderRequest,
  OrderResponse,
  OrderStatusResponse,
} from "../types/pedidoTypes";

export function createOrder(payload: CreateOrderRequest) {
  return apiRequest<OrderResponse>("/api/pedidos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrderStatus(orderId: string) {
  return apiRequest<OrderStatusResponse>(`/api/pedidos/${orderId}/status`);
}
