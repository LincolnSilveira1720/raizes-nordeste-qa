from .dto import EventoAuditoriaDto
from .repository import AuditoriaRepository


class AuditoriaService:
    def __init__(self, auditoria_repository):
        self.auditoria_repository = auditoria_repository

    def registrar(self, tipo, mensagem, nivel="INFO", entidade="PEDIDO", entidade_id=None):
        return self.auditoria_repository.registrar(
            EventoAuditoriaDto(
                tipo=tipo,
                mensagem=mensagem,
                nivel=nivel,
                entidade=entidade,
                entidade_id=entidade_id,
            )
        )


def build_auditoria_service(connection):
    return AuditoriaService(AuditoriaRepository(connection))
