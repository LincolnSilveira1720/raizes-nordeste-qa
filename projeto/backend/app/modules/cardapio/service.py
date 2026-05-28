from ..unidade.service import build_unidade_service
from .dto import CardapioDto
from .repository import CardapioRepository


class CardapioService:
    def __init__(self, unidade_service, cardapio_repository):
        self.unidade_service = unidade_service
        self.cardapio_repository = cardapio_repository

    def obter_cardapio(self, unidade_id):
        unidade = self.unidade_service.obter_disponivel(unidade_id)
        produtos = self.cardapio_repository.listar_por_unidade(unidade_id)
        return CardapioDto(unidade.id, unidade.nome, produtos).to_payload()

    def obter_produto_disponivel(self, unidade_id, produto_id):
        return self.cardapio_repository.obter_produto_disponivel(unidade_id, produto_id)


def build_cardapio_service(connection):
    return CardapioService(
        build_unidade_service(connection),
        CardapioRepository(connection),
    )
