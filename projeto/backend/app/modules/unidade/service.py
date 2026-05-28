from ...common.errors import ApiError
from .repository import UnidadeRepository


def build_unidade_service(connection):
    return UnidadeService(UnidadeRepository(connection))


class UnidadeService:
    def __init__(self, unidade_repository):
        self.unidade_repository = unidade_repository

    def listar_unidades(self):
        return [unidade.to_payload() for unidade in self.unidade_repository.listar_ativas()]

    def obter_disponivel(self, unidade_id):
        unidade = self.unidade_repository.obter_por_id(unidade_id)
        if unidade is None:
            raise ApiError(404, "UNIDADE_NAO_ENCONTRADA", "Unidade nao encontrada.")
        if not unidade.ativa:
            raise ApiError(400, "UNIDADE_INATIVA", "Unidade indisponivel para pedidos.")
        return unidade
