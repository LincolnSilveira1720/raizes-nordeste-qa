import pytest

from app.common.errors import ApiError
from app.modules.pagamento.service import PagamentoService


def test_payment_service_approves_controlled_scenario():
    outcome = PagamentoService().simular("PED-001", 12.9, "APROVADO")

    assert outcome.resultado == "APROVADO"
    assert outcome.codigo_autorizacao.startswith("AUTH-")


def test_payment_service_rejects_unknown_scenario():
    with pytest.raises(ApiError) as error:
        PagamentoService().simular("PED-001", 12.9, "LENTO")

    assert error.value.code == "CENARIO_PAGAMENTO_INVALIDO"
