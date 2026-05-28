import type { Product } from "../../cardapio/types/cardapioTypes";
import type { CartItem } from "../types/pedidoTypes";

export function addProduct(items: CartItem[], product: Product) {
  const existing = items.find((item) => item.product.id === product.id);
  if (existing) {
    return updateQuantity(items, product.id, existing.quantity + 1);
  }
  return [...items, { product, quantity: 1 }];
}

export function updateQuantity(items: CartItem[], productId: string, quantity: number) {
  if (quantity <= 0) {
    return items.filter((item) => item.product.id !== productId);
  }

  return items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item,
  );
}

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.preco * item.quantity, 0);
}

export function orderItems(items: CartItem[]) {
  return items.map((item) => ({
    produtoId: item.product.id,
    quantidade: item.quantity,
  }));
}
