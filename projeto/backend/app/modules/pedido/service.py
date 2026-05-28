from decimal import Decimal, ROUND_HALF_UP

from ...common.enums import OrderStatus, PaymentResult
from ...common.errors import ApiError
from ...shared.utils.ids import new_id
from ...shared.utils.time import now_iso
from ..auditoria.service import build_auditoria_service
from ..cardapio.service import build_cardapio_service
from ..pagamento.service import build_pagamento_service
from ..privacidade.service import build_privacidade_service
from ..unidade.service import build_unidade_service
from .dto import CriacaoPedidoDto, ResultadoPedidoDto
from .repository import PedidoRepository


class PedidoService:
    def __init__(
        self,
        unidade_service,
        cardapio_service,
        pedido_repository,
        pagamento_service,
        auditoria_service,
        privacidade_service,
    ):
        self.unidade_service = unidade_service
        self.cardapio_service = cardapio_service
        self.pedido_repository = pedido_repository
        self.pagamento_service = pagamento_service
        self.auditoria_service = auditoria_service
        self.privacidade_service = privacidade_service

    def criar_pedido(self, payload):
        criacao = CriacaoPedidoDto.from_payload(payload)

        self.unidade_service.obter_disponivel(criacao.unidade_id)
        itens, total = self._montar_itens(criacao.unidade_id, criacao.itens)

        pedido_duplicado = self.pedido_repository.obter_por_chave_idempotencia(
            criacao.idempotency_key
        )
        if pedido_duplicado:
            if (
                pedido_duplicado.get("request_hash")
                and pedido_duplicado["request_hash"] != criacao.request_hash
            ):
                self.auditoria_service.registrar(
                    "IDEMPOTENCIA_DIVERGENTE",
                    "Chave de idempotencia reutilizada com payload diferente.",
                    nivel="WARN",
                    entidade_id=pedido_duplicado["id"],
                )
                raise ApiError(
                    409,
                    "IDEMPOTENCY_PAYLOAD_DIVERGENTE",
                    "Use uma nova chave de confirmacao para uma tentativa diferente.",
                )
            self.auditoria_service.registrar(
                "DUPLICIDADE_PEDIDO",
                "Chave de idempotencia reutilizada.",
                nivel="WARN",
                entidade_id=pedido_duplicado["id"],
            )
            return ResultadoPedidoDto(self._payload_pedido(pedido_duplicado), 200)

        timestamp = now_iso()
        pedido = self.pedido_repository.criar(
            {
                "id": new_id("PED"),
                "unidade_id": criacao.unidade_id,
                "nome_cliente": criacao.cliente.nome,
                "telefone_cliente": criacao.cliente.telefone,
                "aceite_comunicacao": criacao.cliente.aceite_comunicacao,
                "status": OrderStatus.WAITING_PAYMENT,
                "valor_total": float(total),
                "idempotency_key": criacao.idempotency_key,
                "request_hash": criacao.request_hash,
                "criado_em": timestamp,
                "atualizado_em": timestamp,
            },
            itens,
        )
        self.auditoria_service.registrar(
            "PEDIDO_CRIADO",
            "Pedido criado e aguardando retorno do pagamento.",
            entidade_id=pedido["id"],
        )

        if criacao.cliente.aceite_comunicacao_informado:
            self.privacidade_service.registrar_escolha_comunicacao(
                pedido["id"], criacao.cliente.aceite_comunicacao
            )

        pagamento = self.pagamento_service.simular_para_pedido(
            pedido["id"], total, criacao.cenario_pagamento
        )

        if pagamento.resultado == PaymentResult.APPROVED:
            pedido_confirmado = self.pedido_repository.atualizar_status(
                pedido["id"], OrderStatus.CONFIRMED, now_iso()
            )
            self.auditoria_service.registrar(
                "PAGAMENTO_APROVADO",
                "Pagamento aprovado e pedido confirmado.",
                entidade_id=pedido["id"],
            )
            return ResultadoPedidoDto(self._payload_pedido(pedido_confirmado), 201)

        if pagamento.resultado == PaymentResult.DENIED:
            pedido_negado = self.pedido_repository.atualizar_status(
                pedido["id"], OrderStatus.PAYMENT_DENIED, now_iso()
            )
            self.auditoria_service.registrar(
                "PAGAMENTO_NEGADO",
                "Pagamento negado; pedido nao confirmado.",
                nivel="WARN",
                entidade_id=pedido["id"],
            )
            return ResultadoPedidoDto(self._payload_pedido(pedido_negado), 200)

        pedido_com_falha = self.pedido_repository.atualizar_status(
            pedido["id"], OrderStatus.PAYMENT_ERROR, now_iso()
        )
        rastreio = self.auditoria_service.registrar(
            "FALHA_PAGAMENTO",
            "Falha controlada no servico de pagamento simulado.",
            nivel="ERROR",
            entidade_id=pedido_com_falha["id"],
        )
        raise ApiError(
            503,
            "PAGAMENTO_INDISPONIVEL",
            "Nao foi possivel concluir o pagamento agora. Tente novamente em instantes.",
            trace=rastreio,
        )

    def obter_status(self, pedido_id):
        pedido = self.pedido_repository.obter_por_id(pedido_id)
        if pedido is None:
            raise ApiError(404, "PEDIDO_NAO_ENCONTRADO", "Pedido nao encontrado.")
        return {
            "pedidoId": pedido["id"],
            "status": pedido["status"],
            "mensagem": self._mensagem_status(pedido["status"]),
            "ultimaAtualizacao": pedido["atualizado_em"],
        }

    def _montar_itens(self, unidade_id, itens_solicitados):
        itens = []
        total = Decimal("0.00")

        for item in itens_solicitados:
            if not isinstance(item.quantidade, int) or item.quantidade <= 0:
                raise ApiError(
                    400,
                    "QUANTIDADE_INVALIDA",
                    "A quantidade deve ser maior que zero.",
                )

            produto = self.cardapio_service.obter_produto_disponivel(
                unidade_id, item.produto_id
            )
            if produto is None:
                raise ApiError(
                    400,
                    "PRODUTO_INDISPONIVEL",
                    "Este produto nao esta disponivel na unidade selecionada.",
                )

            preco_unitario = Decimal(str(produto.preco))
            subtotal = (preco_unitario * item.quantidade).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
            total += subtotal
            itens.append(
                {
                    "produto_id": item.produto_id,
                    "quantidade": item.quantidade,
                    "preco_unitario": float(preco_unitario),
                    "subtotal": float(subtotal),
                }
            )

        return itens, total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def _payload_pedido(pedido):
        mensagem = PedidoService._mensagem_status(pedido["status"])
        payload = {
            "pedidoId": pedido["id"],
            "status": pedido["status"],
            "valorTotal": pedido["valor_total"],
            "mensagem": mensagem,
        }
        if pedido["status"] == OrderStatus.CONFIRMED:
            payload["unidadeId"] = pedido["unidade_id"]
        return payload

    @staticmethod
    def _mensagem_status(status):
        mensagens = {
            OrderStatus.CONFIRMED: "Pedido confirmado para retirada.",
            OrderStatus.PAYMENT_DENIED: (
                "Pagamento nao aprovado. Revise os dados ou tente outra forma de pagamento."
            ),
            OrderStatus.PAYMENT_ERROR: (
                "Nao foi possivel concluir o pagamento agora. Tente novamente em instantes."
            ),
            OrderStatus.WAITING_PAYMENT: "Pedido aguardando pagamento.",
        }
        return mensagens.get(status, "Pedido em processamento.")


def build_pedido_service(connection):
    return PedidoService(
        unidade_service=build_unidade_service(connection),
        cardapio_service=build_cardapio_service(connection),
        pedido_repository=PedidoRepository(connection),
        pagamento_service=build_pagamento_service(connection),
        auditoria_service=build_auditoria_service(connection),
        privacidade_service=build_privacidade_service(connection),
    )
