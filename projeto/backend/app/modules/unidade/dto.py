from dataclasses import dataclass


@dataclass(frozen=True)
class UnidadeDto:
    id: str
    nome: str
    tipo: str
    ativa: bool

    def to_payload(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "tipo": self.tipo,
            "ativa": self.ativa,
        }
