import { describe, expect, it } from "vitest";

import { addProduct, cartCount, cartTotal, updateQuantity } from "./cart";
import type { Product } from "../../cardapio/types/cardapioTypes";

const tapioca: Product = {
  id: "P-01",
  nome: "Tapioca",
  descricao: "Teste",
  preco: 12.9,
  disponivel: true,
};

describe("cart rules", () => {
  it("increments an existing product and calculates total", () => {
    const items = addProduct(addProduct([], tapioca), tapioca);

    expect(cartCount(items)).toBe(2);
    expect(cartTotal(items)).toBeCloseTo(25.8);
  });

  it("removes the item when quantity reaches zero", () => {
    const items = updateQuantity(addProduct([], tapioca), "P-01", 0);

    expect(items).toEqual([]);
  });
});
