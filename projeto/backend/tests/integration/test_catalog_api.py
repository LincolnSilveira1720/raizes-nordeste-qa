def test_lists_only_active_units(client):
    response = client.get("/api/unidades")

    assert response.status_code == 200
    assert [unit["id"] for unit in response.json] == ["U-03", "U-01", "U-02"]
    assert all(unit["ativa"] for unit in response.json)


def test_menu_filters_products_by_unit(client):
    response = client.get("/api/unidades/U-02/cardapio")

    assert response.status_code == 200
    assert response.json["unidadeId"] == "U-02"
    assert [product["id"] for product in response.json["produtos"]] == ["P-03", "P-01"]


def test_menu_rejects_inactive_unit(client):
    response = client.get("/api/unidades/U-99/cardapio")

    assert response.status_code == 400
    assert response.json["codigo"] == "UNIDADE_INATIVA"
