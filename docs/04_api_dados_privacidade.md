# 04 - API, Dados e Privacidade

## 1. Objetivo

Consolidar o contrato minimo da API, a modelagem de dados da primeira fatia e as diretrizes de privacidade aplicaveis ao fluxo de pedido.

## 2. Convencoes da API

| Item | Padrao |
|---|---|
| Base path | `/api` |
| Formato | JSON |
| Datas | ISO 8601 quando aplicavel |
| IDs | Strings controladas ou UUID conforme evolucao |
| Erros | Codigo, mensagem, detalhe opcional e rastreio quando relevante |

## 3. Endpoints

| Metodo | Endpoint | Responsabilidade |
|---|---|---|
| `GET` | `/api/health` | Verificar disponibilidade local da API. |
| `GET` | `/api/unidades` | Listar unidades ativas. |
| `GET` | `/api/unidades/{id}/cardapio` | Exibir produtos disponiveis na unidade. |
| `POST` | `/api/pedidos` | Criar pedido e executar pagamento simulado. |
| `GET` | `/api/pedidos/{id}/status` | Consultar status atual. |
| `POST` | `/api/pagamentos/simular` | Exercitar simulacao direta de pagamento em testes controlados. |

## 4. Payload principal de pedido

### Request

```json
{
  "unidadeId": "U-01",
  "cliente": {
    "nome": "Cliente Teste",
    "telefone": null,
    "aceiteComunicacao": false
  },
  "itens": [
    {
      "produtoId": "P-01",
      "quantidade": 1
    }
  ],
  "pagamento": {
    "cenario": "APROVADO"
  },
  "idempotencyKey": "pedido-u01-001"
}
```

O campo canonico para pagamento e `pagamento.cenario`. Para compatibilidade com colecoes manuais de QA, o backend tambem aceita `cenarioPagamento` na raiz do payload.

### Respostas de referencia

| Cenario | HTTP | Estado esperado |
|---|---|---|
| Pagamento aprovado | `201` | Pedido `CONFIRMADO`. |
| Pagamento negado | `200` | Pedido `PAGAMENTO_NEGADO`. |
| Falha no pagamento | `503` | Erro `PAGAMENTO_INDISPONIVEL` com rastreio. |
| Pedido vazio | `400` | Erro `PEDIDO_VAZIO`. |
| Quantidade invalida | `400` | Erro `QUANTIDADE_INVALIDA`. |
| Produto indisponivel | `400` | Erro `PRODUTO_INDISPONIVEL`. |
| Unidade inexistente | `404` | Erro `UNIDADE_NAO_ENCONTRADA`. |
| Idempotencia com payload diferente | `409` | Erro `IDEMPOTENCY_PAYLOAD_DIVERGENTE`. |

### Modelo de erro

```json
{
  "timestamp": "2026-05-18T10:30:00",
  "codigo": "CODIGO_ERRO",
  "mensagem": "Mensagem compreensivel para o usuario.",
  "detalhe": "Detalhe tecnico opcional para ambiente de teste.",
  "rastreio": "AUD-0001"
}
```

## 5. Estados principais

### Pedido

```text
CRIADO
AGUARDANDO_PAGAMENTO
PAGAMENTO_APROVADO
PAGAMENTO_NEGADO
CONFIRMADO
ERRO_PAGAMENTO
CANCELADO
```

### Pagamento simulado

```text
APROVADO
NEGADO
FALHA
```

## 6. Entidades

| Entidade | Campos essenciais | Finalidade |
|---|---|---|
| Unidade | `id`, `nome`, `tipo`, `ativa` | Identificar local de retirada. |
| Produto | `id`, `nome`, `preco`, `ativo`, `sazonal` | Representar item de cardapio. |
| CardapioUnidade | `unidadeId`, `produtoId`, `disponivel` | Controlar disponibilidade local. |
| Pedido | `id`, `unidadeId`, `status`, `valorTotal`, `idempotencyKey` | Guardar o fluxo de compra. |
| ItemPedido | `pedidoId`, `produtoId`, `quantidade`, `subtotal` | Guardar itens validos. |
| PagamentoSimulado | `pedidoId`, `resultado`, `mensagem` | Registrar retorno controlado. |
| AuditoriaEvento | `tipo`, `entidadeId`, `nivel`, `mensagem` | Evidenciar eventos relevantes. |
| Consentimento | `pedidoId`, `finalidade`, `aceito` | Registrar escolha de privacidade. |

## 7. Relacionamentos

```text
Unidade 1---N CardapioUnidade N---1 Produto
Unidade 1---N Pedido
Pedido 1---N ItemPedido N---1 Produto
Pedido 1---1 PagamentoSimulado
Pedido 1---N AuditoriaEvento
Pedido 0---N Consentimento
```

## 8. Massa controlada

| Tipo | Dados de referencia |
|---|---|
| Unidades | `U-01 Recife Centro`, `U-02 Salvador Shopping`, `U-03 Fortaleza Beira-Mar`. |
| Produtos | Tapioca, cuscuz, bolo de macaxeira, suco de caja e combo sazonal. |
| Variacao | `U-02` nao possui todos os produtos e serve para teste negativo. |

## 9. Validacoes de dados

- unidade deve existir e estar ativa;
- pedido deve ter item valido;
- quantidade deve ser maior que zero;
- produto deve estar disponivel na unidade;
- total e calculado a partir dos itens validados;
- pagamento aprovado e precondicao para confirmacao;
- `idempotencyKey` reaproveitada so pode retornar o pedido anterior quando o payload for equivalente;
- falha de pagamento gera auditoria;
- dados pessoais permanecem opcionais e minimizados.

## 10. Privacidade e LGPD

### Dados possiveis

| Dado | Uso no recorte |
|---|---|
| Nome | Identificacao opcional para retirada. |
| Telefone ou e-mail | Apenas comunicacao explicita quando houver necessidade. |
| Unidade escolhida | Necessaria para cardapio e retirada. |
| Historico e fidelizacao | Fora da primeira fatia. |

### Diretrizes

1. Pedido simples nao exige cadastro completo.
2. Comunicacao e fidelizacao nao podem ser confundidas com pagamento ou retirada.
3. O aviso de finalidade aparece antes de coletar dado pessoal relevante.
4. Logs e mensagens de erro nao exibem dados pessoais desnecessarios.
5. Consentimentos aplicaveis sao rastreaveis e testaveis.

### Testes de privacidade

| ID | Validacao |
|---|---|
| LGPD-01 | Finalidade exibida ao solicitar dado pessoal. |
| LGPD-02 | Recusa de promocao nao bloqueia pedido simples. |
| LGPD-03 | Aceite aplicavel gera registro de consentimento. |
| LGPD-04 | Erro de pagamento nao expoe dado sensivel. |
| LGPD-05 | Log tecnico nao carrega dado pessoal excessivo. |

## 11. Regra de evolucao

Qualquer novo endpoint ou campo de dado deve indicar:

- dominio responsavel;
- requisito atendido;
- impacto em testes;
- impacto em privacidade;
- evidencia esperada.
