import hashlib
import json
from dataclasses import dataclass

from ...common.errors import ApiError


@dataclass(frozen=True)
class ItemCriacaoPedidoDto:
    produto_id: str | None
    quantidade: int | None

    @classmethod
    def from_payload(cls, payload):
        item = payload if isinstance(payload, dict) else {}
        return cls(
            produto_id=item.get("produtoId"),
            quantidade=item.get("quantidade"),
        )


@dataclass(frozen=True)
class ClientePedidoDto:
    nome: str | None
    telefone: str | None
    aceite_comunicacao: bool
    aceite_comunicacao_informado: bool

    @classmethod
    def from_payload(cls, payload):
        cliente = payload if isinstance(payload, dict) else {}
        return cls(
            nome=cliente.get("nome"),
            telefone=cliente.get("telefone"),
            aceite_comunicacao=bool(cliente.get("aceiteComunicacao", False)),
            aceite_comunicacao_informado="aceiteComunicacao" in cliente,
        )


@dataclass(frozen=True)
class CriacaoPedidoDto:
    unidade_id: str
    itens: list[ItemCriacaoPedidoDto]
    cliente: ClientePedidoDto
    cenario_pagamento: str | None
    idempotency_key: str
    request_hash: str

    @classmethod
    def from_payload(cls, payload):
        data = payload if isinstance(payload, dict) else {}
        unidade_id = data.get("unidadeId")
        itens = data.get("itens")
        idempotency_key = str(data.get("idempotencyKey") or "").strip()

        if not unidade_id:
            raise ApiError(400, "UNIDADE_OBRIGATORIA", "Selecione uma unidade para continuar.")
        if not isinstance(itens, list) or not itens:
            raise ApiError(400, "PEDIDO_VAZIO", "Adicione pelo menos um item para continuar.")
        if not idempotency_key:
            raise ApiError(
                400,
                "IDEMPOTENCY_KEY_OBRIGATORIA",
                "Envie uma chave de confirmacao para evitar pedidos duplicados.",
            )

        itens_dto = [ItemCriacaoPedidoDto.from_payload(item) for item in itens]
        cliente = ClientePedidoDto.from_payload(data.get("cliente"))
        pagamento = data.get("pagamento")
        pagamento = pagamento if isinstance(pagamento, dict) else {}
        cenario_pagamento = pagamento.get("cenario") or data.get("cenarioPagamento")
        return cls(
            unidade_id=unidade_id,
            itens=itens_dto,
            cliente=cliente,
            cenario_pagamento=cenario_pagamento,
            idempotency_key=idempotency_key,
            request_hash=_request_hash(unidade_id, itens_dto, cliente, cenario_pagamento),
        )


@dataclass(frozen=True)
class ResultadoPedidoDto:
    payload: dict
    status_code: int


def _request_hash(unidade_id, itens, cliente, cenario_pagamento):
    canonical_payload = {
        "unidadeId": unidade_id,
        "itens": [
            {"produtoId": item.produto_id, "quantidade": item.quantidade}
            for item in itens
        ],
        "cliente": {
            "nome": cliente.nome,
            "telefone": cliente.telefone,
            "aceiteComunicacao": cliente.aceite_comunicacao,
            "aceiteComunicacaoInformado": cliente.aceite_comunicacao_informado,
        },
        "cenarioPagamento": cenario_pagamento,
    }
    payload = json.dumps(
        canonical_payload,
        ensure_ascii=True,
        separators=(",", ":"),
        sort_keys=True,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()
