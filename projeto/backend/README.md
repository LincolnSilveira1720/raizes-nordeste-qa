# Backend Flask

API minima para o fluxo de pedido para retirada com pagamento simulado.

## Responsabilidades

| Caminho | Responsabilidade |
|---|---|
| `app/modules/unidade/` | Listagem de unidades ativas e dados da loja. |
| `app/modules/cardapio/` | Endpoint, regra e persistencia do cardapio por unidade. |
| `app/modules/pedido/` | Criacao, status, idempotencia e orquestracao do pedido. |
| `app/modules/pagamento/` | Simulacao de pagamento e persistencia do retorno. |
| `app/modules/auditoria/` | Eventos tecnicos rastreaveis. |
| `app/modules/privacidade/` | Registro de consentimento do fluxo. |
| `app/system/` | Healthcheck e recursos tecnicos fora do dominio de negocio. |
| `app/config/` | Settings, conexao, schema e seed SQLite. |
| `app/common/` | Erros HTTP e vocabulario transversal usado por mais de um dominio. |
| `app/shared/` | Utilitarios tecnicos puros, sem regra de dominio ou persistencia. |
| `tests/unit/` | Regras isoladas, sem fluxo HTTP completo. |
| `tests/integration/` | Contrato da API e fluxo entre camadas. |

Cada modulo de dominio usa nome no singular e possui `dto.py`, `service.py` e `repository.py` quando ha persistencia. Modulos se integram por services; repository de um dominio nao e dependencia direta de outro.

## Endpoints

```text
GET  /api/health
GET  /api/unidades
GET  /api/unidades/{id}/cardapio
POST /api/pedidos
GET  /api/pedidos/{id}/status
POST /api/pagamentos/simular
```

## Execucao local

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:FLASK_APP = "app"
.\.venv\Scripts\python.exe -m flask run --debug
```

Quando `python` nao estiver no PATH, use um executavel Python disponivel para criar a `.venv`.

## Testes

```powershell
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing
```

O banco de desenvolvimento fica em `instance/raizes.db`. Os testes usam banco temporario.
