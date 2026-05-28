from ...common.enums import PaymentResult
from ...common.errors import ApiError
from ...shared.utils.ids import new_id
from .dto import ResultadoPagamentoDto
from .repository import PagamentoRepository


class PagamentoService:
    def __init__(self, pagamento_repository=None):
        self.pagamento_repository = pagamento_repository

    def simular(self, pedido_id, valor, cenario):
        selected_scenario = str(cenario or "").upper()

        if selected_scenario == PaymentResult.APPROVED:
            return ResultadoPagamentoDto(
                resultado=PaymentResult.APPROVED,
                mensagem=f"Pagamento simulado aprovado para {valor:.2f}.",
                codigo_autorizacao=new_id("AUTH"),
            )
        if selected_scenario == PaymentResult.DENIED:
            return ResultadoPagamentoDto(
                resultado=PaymentResult.DENIED,
                mensagem="Pagamento nao aprovado.", 
            )
        if selected_scenario == PaymentResult.FAILURE:
            return ResultadoPagamentoDto(
                resultado=PaymentResult.FAILURE,
                mensagem="Servico de pagamento indisponivel.",
            )

        raise ApiError(
            400,
            "CENARIO_PAGAMENTO_INVALIDO",
            "Escolha um cenario de pagamento valido.",
            detail=f"Cenario recebido para {pedido_id or 'pedido novo'}: {cenario!r}.",
        )

    def simular_para_pedido(self, pedido_id, valor, cenario):
        pagamento = self.simular(pedido_id, valor, cenario)
        if self.pagamento_repository is None:
            raise RuntimeError("PagamentoRepository necessario para registrar simulacao.")
        self.pagamento_repository.registrar(pedido_id, pagamento)
        return pagamento


def build_pagamento_service(connection):
    return PagamentoService(PagamentoRepository(connection))
