from dataclasses import dataclass


@dataclass(frozen=True)
class ResultadoPagamentoDto:
    resultado: str
    mensagem: str
    codigo_autorizacao: str | None = None

    def to_payload(self, pedido_id):
        payload = {
            "pedidoId": pedido_id,
            "resultado": self.resultado,
        }
        if self.codigo_autorizacao:
            payload["codigoAutorizacao"] = self.codigo_autorizacao
        else:
            payload["mensagem"] = self.mensagem
        return payload
