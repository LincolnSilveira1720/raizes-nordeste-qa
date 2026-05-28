from dataclasses import dataclass


@dataclass(frozen=True)
class EventoAuditoriaDto:
    tipo: str
    mensagem: str
    nivel: str = "INFO"
    entidade: str = "PEDIDO"
    entidade_id: str | None = None
