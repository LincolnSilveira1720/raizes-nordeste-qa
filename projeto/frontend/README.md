# Frontend React

Interface mobile-first do pedido para retirada com pagamento simulado.

## Responsabilidades

| Caminho | Responsabilidade |
|---|---|
| `src/pages/pedido-retirada/` | Page da jornada, sections e orquestracao do fluxo. |
| `src/features/unidades/` | API e tipos da selecao de unidade. |
| `src/features/cardapio/` | API e tipos do cardapio. |
| `src/features/pedido/` | API, componentes, tipos e regras do carrinho/pedido. |
| `src/features/pagamento/` | Tipos da simulacao de pagamento. |
| `src/features/privacidade/` | Controle reutilizavel de consentimento. |
| `src/shared/` | UI, estilos e tipos genericos. |
| `src/services/` | Cliente HTTP base para o contrato `/api`. |
| `tests/e2e/` | Fluxos de navegador com API controlada por mocks. |

## Execucao local

```powershell
npm.cmd install
npm.cmd run dev
```

O Vite redireciona `/api` para `http://127.0.0.1:5000` em desenvolvimento.

## Testes

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
```

Os testes unitarios cobrem regras do carrinho e tratamento de API. O E2E inicial cobre a jornada aprovada da page de retirada.
