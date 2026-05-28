import { ShieldCheck } from "lucide-react";

import { ConsentCheckbox } from "../../../features/privacidade/components/ConsentCheckbox";

interface PrivacidadeSectionProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}

export function PrivacidadeSection({ accepted, onChange }: PrivacidadeSectionProps) {
  return (
    <section className="privacy-strip" aria-labelledby="privacy-title">
      <ShieldCheck aria-hidden="true" />

      <div className="privacy-content">
        <strong id="privacy-title">Privacidade e uso dos dados</strong>

        <p>
          Usamos nome e telefone apenas para identificar o pedido e comunicar atualizações
          sobre a retirada. O pagamento é simulado e não solicita dados financeiros reais.
        </p>

        <ConsentCheckbox
          checked={accepted}
          label="Autorizo o uso do meu contato apenas para comunicação sobre este pedido."
          onChange={onChange}
        />
      </div>
    </section>
  );
}
