import { ArrowRight, Store } from "lucide-react";

import type { Unit } from "../../../features/unidades/types/unidadeTypes";

interface SelecionarUnidadeSectionProps {
  loading: boolean;
  units: Unit[];
  onSelect: (unit: Unit) => void;
}

export function SelecionarUnidadeSection({
  loading,
  units,
  onSelect,
}: SelecionarUnidadeSectionProps) {
  return (
    <section className="flow-grid flow-grid-units">
      <div className="page-heading">
        <h2>Escolha a unidade</h2>
        <p>Cardapio e disponibilidade seguem a loja selecionada.</p>
      </div>

      <div className="unit-list">
        {loading ? <p className="loading-line">Carregando unidades...</p> : null}
        {units.map((unit) => (
          <button className="unit-row" key={unit.id} onClick={() => onSelect(unit)} type="button">
            <span className="unit-icon">
              <Store aria-hidden="true" />
            </span>
            <span>
              <strong>{unit.nome}</strong>
              <small>{unit.tipo.replaceAll("_", " ")}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
