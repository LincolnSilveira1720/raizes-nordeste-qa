import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

import type { Menu, Product } from "../../../features/cardapio/types/cardapioTypes";
import { money } from "../../../features/pedido/components/OrderSummary";
import { QuantityStepper } from "../../../features/pedido/components/QuantityStepper";
import type { CartItem } from "../../../features/pedido/types/pedidoTypes";
import type { Unit } from "../../../features/unidades/types/unidadeTypes";
import { CarrinhoSection } from "./CarrinhoSection";

interface CardapioSectionProps {
  cart: CartItem[];
  menu: Menu;
  selectedUnit: Unit;
  onBack: () => void;
  onAdd: (product: Product) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onReview: () => void;
}

export function CardapioSection({
  cart,
  menu,
  selectedUnit,
  onBack,
  onAdd,
  onQuantityChange,
  onReview,
}: CardapioSectionProps) {
  return (
    <section className="flow-grid menu-grid">
      <div>
        <div className="page-heading page-heading-inline">
          <button className="text-command" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" />
            Unidades
          </button>
          <div>
            <h2>{selectedUnit.nome}</h2>
            <p>Itens disponiveis para retirada.</p>
          </div>
        </div>

        <div className="product-list">
          {menu.produtos.map((product) => {
            const cartItem = cart.find((item) => item.product.id === product.id);
            return (
              <article className="product-row" key={product.id}>
                <span className="product-swatch" aria-hidden="true" />
                <div className="product-copy">
                  <h3>{product.nome}</h3>
                  <p>{product.descricao}</p>
                  <strong>{money(product.preco)}</strong>
                </div>
                {cartItem ? (
                  <QuantityStepper
                    label={product.nome}
                    quantity={cartItem.quantity}
                    onChange={(quantity) => onQuantityChange(product.id, quantity)}
                  />
                ) : (
                  <button
                    aria-label={`Adicionar ${product.nome}`}
                    className="icon-command"
                    onClick={() => onAdd(product)}
                    title={`Adicionar ${product.nome}`}
                    type="button"
                  >
                    <Plus aria-hidden="true" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <aside className="side-stack">
        <CarrinhoSection cart={cart} />
        <button className="primary-command" onClick={onReview} type="button">
          Revisar pedido
          <ArrowRight aria-hidden="true" />
        </button>
      </aside>
    </section>
  );
}
