def order_payload(**overrides):
    payload = {
        "unidadeId": "U-01",
        "cliente": {
            "nome": "Cliente Teste",
            "telefone": None,
            "aceiteComunicacao": False,
        },
        "itens": [{"produtoId": "P-01", "quantidade": 1}],
        "pagamento": {"cenario": "APROVADO"},
        "idempotencyKey": "pedido-u01-001",
    }
    payload.update(overrides)
    return payload


def test_approved_order_can_be_queried_by_status(client):
    created = client.post("/api/pedidos", json=order_payload())

    assert created.status_code == 201
    assert created.json["status"] == "CONFIRMADO"
    assert created.json["valorTotal"] == 12.9

    status = client.get(f"/api/pedidos/{created.json['pedidoId']}/status")

    assert status.status_code == 200
    assert status.json["status"] == "CONFIRMADO"


def test_empty_order_is_rejected(client):
    response = client.post("/api/pedidos", json=order_payload(itens=[]))

    assert response.status_code == 400
    assert response.json["codigo"] == "PEDIDO_VAZIO"


def test_product_from_another_unit_is_rejected(client):
    response = client.post(
        "/api/pedidos",
        json=order_payload(
            unidadeId="U-02",
            itens=[{"produtoId": "P-02", "quantidade": 1}],
            idempotencyKey="pedido-u02-cuscuz",
        ),
    )

    assert response.status_code == 400
    assert response.json["codigo"] == "PRODUTO_INDISPONIVEL"


def test_idempotency_reuse_does_not_skip_product_validation(client):
    first = client.post(
        "/api/pedidos",
        json=order_payload(idempotencyKey="teste-produto-indisponivel-001"),
    )
    assert first.status_code == 201

    response = client.post(
        "/api/pedidos",
        json={
            "unidadeId": "U-02",
            "itens": [{"produtoId": "P-04", "quantidade": 1}],
            "cenarioPagamento": "APROVADO",
            "idempotencyKey": "teste-produto-indisponivel-001",
        },
    )

    assert response.status_code == 400
    assert response.json["codigo"] == "PRODUTO_INDISPONIVEL"


def test_flat_payment_scenario_alias_is_supported(client):
    payload = order_payload(idempotencyKey="pedido-cenario-flat")
    payload.pop("pagamento")
    payload["cenarioPagamento"] = "APROVADO"

    response = client.post("/api/pedidos", json=payload)

    assert response.status_code == 201
    assert response.json["status"] == "CONFIRMADO"


def test_same_idempotency_key_with_different_valid_payload_is_rejected(client):
    first = client.post(
        "/api/pedidos",
        json=order_payload(idempotencyKey="pedido-payload-divergente"),
    )
    assert first.status_code == 201

    response = client.post(
        "/api/pedidos",
        json=order_payload(
            itens=[{"produtoId": "P-03", "quantidade": 1}],
            idempotencyKey="pedido-payload-divergente",
        ),
    )

    assert response.status_code == 409
    assert response.json["codigo"] == "IDEMPOTENCY_PAYLOAD_DIVERGENTE"


def test_denied_payment_does_not_confirm_order(client):
    response = client.post(
        "/api/pedidos",
        json=order_payload(
            pagamento={"cenario": "NEGADO"},
            idempotencyKey="pedido-negado",
        ),
    )

    assert response.status_code == 200
    assert response.json["status"] == "PAGAMENTO_NEGADO"


def test_payment_failure_returns_trace(client):
    response = client.post(
        "/api/pedidos",
        json=order_payload(
            pagamento={"cenario": "FALHA"},
            idempotencyKey="pedido-falha",
        ),
    )

    assert response.status_code == 503
    assert response.json["codigo"] == "PAGAMENTO_INDISPONIVEL"
    assert response.json["rastreio"].startswith("AUD-")


def test_idempotency_key_reuses_existing_order(client):
    first = client.post("/api/pedidos", json=order_payload(idempotencyKey="pedido-repetido"))
    second = client.post("/api/pedidos", json=order_payload(idempotencyKey="pedido-repetido"))

    assert first.status_code == 201
    assert second.status_code == 200
    assert second.json["pedidoId"] == first.json["pedidoId"]
