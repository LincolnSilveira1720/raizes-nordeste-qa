import { MapPin, ShoppingBag } from "lucide-react";

import type { Unit } from "../../../features/unidades/types/unidadeTypes";

interface AppHeaderProps {
  selectedUnit: Unit | null;
  cartCount: number;
}

export function AppHeader({ selectedUnit, cartCount }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="brand-kicker">Raizes do Nordeste</p>
        <h1>Retirada rapida</h1>
      </div>

      <div className="header-metrics">
        <div className="header-chip">
          <MapPin aria-hidden="true" />
          <span>{selectedUnit?.nome ?? "Escolha a unidade"}</span>
        </div>
        <div className="header-chip header-chip-strong">
          <ShoppingBag aria-hidden="true" />
          <span>{cartCount}</span>
        </div>
      </div>
    </header>
  );
}
