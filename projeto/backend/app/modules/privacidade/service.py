from .dto import ConsentimentoComunicacaoDto
from .repository import PrivacidadeRepository


class PrivacidadeService:
    def __init__(self, privacidade_repository):
        self.privacidade_repository = privacidade_repository

    def registrar_escolha_comunicacao(self, pedido_id, aceito):
        self.privacidade_repository.registrar_escolha_comunicacao(
            ConsentimentoComunicacaoDto(pedido_id=pedido_id, aceito=bool(aceito))
        )


def build_privacidade_service(connection):
    return PrivacidadeService(PrivacidadeRepository(connection))
