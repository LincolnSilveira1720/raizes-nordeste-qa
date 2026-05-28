import { useEffect, useMemo, useState } from "react";

import { ApiClientError } from "../../services/apiClient";
import { getMenu } from "../../features/cardapio/api/cardapioApi";
import type { Menu, Product } from "../../features/cardapio/types/cardapioTypes";
import type { PaymentScenario } from "../../features/pagamento/types/pagamentoTypes";
import { createOrder, getOrderStatus } from "../../features/pedido/api/pedidoApi";
import type {
  CartItem,
  CustomerForm,
  OrderResponse,
  OrderStep,
} from "../../features/pedido/types/pedidoTypes";
import { addProduct, cartCount, orderItems, updateQuantity } from "../../features/pedido/utils/cart";
import { listUnits } from "../../features/unidades/api/unidadesApi";
import type { Unit } from "../../features/unidades/types/unidadeTypes";

interface VisibleProblem {
  code: string;
  message: string;
}

function newIdempotencyKey(unitId?: string) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  return `pedido-${unitId ?? "unidade"}-${suffix}`;
}

function problemFromError(error: unknown): VisibleProblem {
  if (error instanceof ApiClientError) {
    return {
      code: error.problem.codigo,
      message: error.problem.rastreio
        ? `${error.problem.mensagem} Rastreio: ${error.problem.rastreio}.`
        : error.problem.mensagem,
    };
  }

  return {
    code: "API_INDISPONIVEL",
    message: "Nao foi possivel carregar os dados agora.",
  };
}

export function usePedidoRetiradaFlow() {
  const [step, setStep] = useState<OrderStep>("units");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [problem, setProblem] = useState<VisibleProblem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey());

  useEffect(() => {
    let active = true;
    setLoadingUnits(true);

    listUnits()
      .then((availableUnits) => {
        if (active) {
          setUnits(availableUnits);
        }
      })
      .catch((error) => {
        if (active) {
          setProblem(problemFromError(error));
        }
      })
      .finally(() => {
        if (active) {
          setLoadingUnits(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const totalItems = useMemo(() => cartCount(cart), [cart]);

  async function selectUnit(unit: Unit) {
    setProblem(null);
    setSelectedUnit(unit);
    setCart([]);
    setIdempotencyKey(newIdempotencyKey(unit.id));

    try {
      setMenu(await getMenu(unit.id));
      setStep("menu");
    } catch (error) {
      setProblem(problemFromError(error));
    }
  }

  function addToCart(product: Product) {
    setCart((items) => addProduct(items, product));
  }

  function changeQuantity(productId: string, quantity: number) {
    setCart((items) => updateQuantity(items, productId, quantity));
  }

  function reviewOrder() {
    if (!cart.length) {
      setProblem({
        code: "PEDIDO_VAZIO",
        message: "Adicione pelo menos um item para continuar.",
      });
      return;
    }
    setProblem(null);
    setStep("review");
  }

  async function submitOrder(customer: CustomerForm, scenario: PaymentScenario) {
    if (!selectedUnit) {
      return;
    }

    setSubmitting(true);
    setProblem(null);

    try {
      const createdOrder = await createOrder({
        unidadeId: selectedUnit.id,
        cliente: {
          nome: customer.nome.trim() || null,
          telefone: customer.telefone.trim() || null,
          aceiteComunicacao: customer.aceiteComunicacao,
        },
        itens: orderItems(cart),
        pagamento: { cenario: scenario },
        idempotencyKey,
      });

      setOrder(createdOrder);
      setStep("status");
    } catch (error) {
      setProblem(problemFromError(error));
      setIdempotencyKey(newIdempotencyKey(selectedUnit.id));
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshOrderStatus() {
    if (!order) {
      return;
    }

    setRefreshingStatus(true);
    setProblem(null);

    try {
      const status = await getOrderStatus(order.pedidoId);
      setOrder((currentOrder) =>
        currentOrder
          ? {
              ...currentOrder,
              status: status.status,
              mensagem: status.mensagem,
            }
          : currentOrder,
      );
    } catch (error) {
      setProblem(problemFromError(error));
    } finally {
      setRefreshingStatus(false);
    }
  }

  function returnToUnits() {
    setProblem(null);
    setStep("units");
  }

  function returnToMenu() {
    setProblem(null);
    setStep("menu");
  }

  function startOver() {
    setSelectedUnit(null);
    setMenu(null);
    setCart([]);
    setOrder(null);
    setProblem(null);
    setIdempotencyKey(newIdempotencyKey());
    setStep("units");
  }

  return {
    addToCart,
    cart,
    cartCount: totalItems,
    changeQuantity,
    loadingUnits,
    menu,
    order,
    problem,
    refreshingStatus,
    refreshOrderStatus,
    returnToMenu,
    returnToUnits,
    reviewOrder,
    selectedUnit,
    selectUnit,
    startOver,
    step,
    submitOrder,
    submitting,
    units,
  };
}
