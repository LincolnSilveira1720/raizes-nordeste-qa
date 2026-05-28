from dataclasses import dataclass


@dataclass(frozen=True)
class ConsentimentoComunicacaoDto:
    pedido_id: str
    aceito: bool
