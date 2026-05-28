import { AlertTriangle } from "lucide-react";

import { AlertBanner } from "../../shared/components/ui/AlertBanner";
import { AppHeader } from "./components/AppHeader";
import { FlowRail } from "./components/FlowRail";
import { CardapioSection } from "./sections/CardapioSection";
import { ConfirmacaoPedidoSection } from "./sections/ConfirmacaoPedidoSection";
import { SelecionarUnidadeSection } from "./sections/SelecionarUnidadeSection";
import { StatusPedidoSection } from "./sections/StatusPedidoSection";
import { usePedidoRetiradaFlow } from "./usePedidoRetiradaFlow";

export function PedidoRetiradaPage() {
  const flow = usePedidoRetiradaFlow();

  return (
    <main className="app-shell">
      <AppHeader selectedUnit={flow.selectedUnit} cartCount={flow.cartCount} />

      <section className="flow-band">
        <FlowRail activeStep={flow.step} />

        {flow.problem ? (
          <AlertBanner
            icon={<AlertTriangle aria-hidden="true" />}
            title={flow.problem.code}
            message={flow.problem.message}
          />
        ) : null}

        {flow.step === "units" ? (
          <SelecionarUnidadeSection
            loading={flow.loadingUnits}
            units={flow.units}
            onSelect={flow.selectUnit}
          />
        ) : null}

        {flow.step === "menu" && flow.selectedUnit && flow.menu ? (
          <CardapioSection
            cart={flow.cart}
            menu={flow.menu}
            selectedUnit={flow.selectedUnit}
            onBack={flow.returnToUnits}
            onAdd={flow.addToCart}
            onQuantityChange={flow.changeQuantity}
            onReview={flow.reviewOrder}
          />
        ) : null}

        {flow.step === "review" && flow.selectedUnit ? (
          <ConfirmacaoPedidoSection
            busy={flow.submitting}
            cart={flow.cart}
            selectedUnit={flow.selectedUnit}
            onBack={flow.returnToMenu}
            onSubmit={flow.submitOrder}
          />
        ) : null}

        {flow.step === "status" && flow.order ? (
          <StatusPedidoSection
            busy={flow.refreshingStatus}
            order={flow.order}
            onRefresh={flow.refreshOrderStatus}
            onRestart={flow.startOver}
          />
        ) : null}
      </section>
    </main>
  );
}
