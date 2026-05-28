from dataclasses import dataclass


@dataclass(frozen=True)
class ProdutoDto:
    id: str
    nome: str
    descricao: str | None
    preco: float
    disponivel: bool

    def to_payload(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "preco": self.preco,
            "disponivel": self.disponivel,
        }


@dataclass(frozen=True)
class CardapioDto:
    unidade_id: str
    unidade_nome: str
    produtos: list[ProdutoDto]

    def to_payload(self):
        return {
            "unidadeId": self.unidade_id,
            "unidadeNome": self.unidade_nome,
            "produtos": [produto.to_payload() for produto in self.produtos],
        }
