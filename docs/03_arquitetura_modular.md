# 03 - Arquitetura Modular

## 1. Objetivo

Definir a arquitetura oficial do projeto para manter backend, frontend, testes e documentacao localizaveis por responsabilidade.

## 2. Decisao arquitetural

O projeto adota:

- backend Flask organizado por dominios;
- frontend React organizado por pages, sections, features e shared;
- API REST como fronteira entre frontend e backend;
- persistencia SQLite na primeira fatia;
- pagamento simulado para testar integracao e falhas;
- testes proximos do dominio e do nivel de validacao.

A abordagem e modular com DDD leve: ela usa fronteiras de negocio para organizar codigo, sem introduzir complexidade de arquitetura distribuida fora do escopo.

## 3. Visao macro

```text
[Cliente mobile]
       |
       v
[Frontend React + TypeScript]
       |
       v
[API REST Flask]
       |
       +--> [Unidades]
       +--> [Cardapio]
       +--> [Pedidos] ---> [Pagamentos]
       +--> [Auditoria]
       +--> [Privacidade]
       |
       v
[SQLite + seed controlado]
       |
       v
[Testes, logs, metricas e evidencias]
```

## 4. Contextos de dominio

| Dominio | Responsabilidade | Fronteira |
|---|---|---|
| Unidades | Unidades ativas, tipo de operacao e contexto da retirada. | Nao calcula pedido nem pagamento. |
| Cardapio | Produtos e disponibilidade por unidade. | Nao confirma pedido. |
| Pedidos | Itens, total, status, idempotencia e orquestracao do fluxo. | Nao processa pagamento real. |
| Pagamentos | Simulacao de aprovado, negado e falha. | Nao conhece regra de cardapio. |
| Auditoria | Eventos tecnicos e operacionais rastreaveis. | Nao altera regra de negocio. |
| Privacidade | Avisos, consentimentos e minimizacao de dados. | Nao exige cadastro completo para pedido simples. |

Dominios futuros como fidelizacao e indicadores podem consumir pedidos confirmados e metricas, mas nao entram na primeira fatia.

## 5. Estrutura oficial do backend

```text
projeto/backend/
  app/
    __init__.py
    system/
      controller.py
    config/
      settings.py
      database.py
    common/
      errors.py
      enums.py
    shared/
      utils/
        ids.py
        time.py
    modules/
      unidade/
        controller.py
        dto.py
        repository.py
        service.py
      cardapio/
        controller.py
        dto.py
        repository.py
        service.py
      pedido/
        controller.py
        dto.py
        repository.py
        service.py
      pagamento/
        controller.py
        dto.py
        repository.py
        service.py
      auditoria/
        dto.py
        repository.py
        service.py
      privacidade/
        dto.py
        repository.py
        service.py
  tests/
    unit/
    integration/
```

### Responsabilidades internas

| Camada | Responsabilidade |
|---|---|
| `controller.py` | Entrada HTTP e serializacao da resposta. |
| `dto.py` | Contratos de entrada, saida e colaboracao expostos pelo modulo. |
| `repository.py` | Consulta e persistencia. |
| `service.py` | Regras e orquestracao do dominio. |
| `common/` | Politicas e vocabulario transversais da aplicacao, como erros HTTP e enums usados por mais de um dominio. |
| `shared/` | Funcoes tecnicas puras e reutilizaveis, sem Flask, persistencia ou regra de dominio. |
| `system/` | Endpoints e recursos tecnicos da aplicacao que nao representam dominio de negocio. |

Os nomes dos modulos de dominio ficam no singular. DTOs nascem dentro do modulo para impedir que payloads e representacoes de persistencia se confundam com a fronteira publicada pelo service.

## 6. Estrutura oficial do frontend

```text
projeto/frontend/src/
  app/
    App.tsx
  shared/
    components/
      ui/
    styles/
    types/
  services/
    apiClient.ts
  features/
    unidades/
      api/
      types/
    cardapio/
      api/
      types/
    pedido/
      api/
      components/
      types/
      utils/
    pagamento/
      types/
    privacidade/
      components/
  pages/
    pedido-retirada/
      PedidoRetiradaPage.tsx
      components/
        AppHeader.tsx
        FlowRail.tsx
      usePedidoRetiradaFlow.ts
      sections/
        SelecionarUnidadeSection.tsx
        CardapioSection.tsx
        CarrinhoSection.tsx
        ConfirmacaoPedidoSection.tsx
        StatusPedidoSection.tsx
        PrivacidadeSection.tsx
```

### Fronteiras do frontend

| Area | Responsabilidade |
|---|---|
| Pages | Montar rotas e jornadas completas. |
| Sections | Separar blocos visuais e evidencias por etapa. |
| Features | Concentrar API, tipos, hooks e componentes de negocio reutilizaveis. |
| Shared | Manter UI, layout e utilitarios genericos. |

A regra de ouro e: **uma page pode usar varias features; uma feature nao depende de uma page**.

## 7. Regras de dependencia

1. Um modulo conversa com outro por `service.py`; o repository interno nao e importado fora do proprio modulo.
2. Controllers chamam services e nao montam repositories de outro dominio diretamente.
3. Regras de negocio nao vivem em componentes visuais nem em controllers.
4. A API e o contrato entre frontend e backend; detalhes de persistencia nao atravessam essa fronteira.
5. Erros devem manter codigo, mensagem e rastreio quando relevante.
6. Testes unitarios validam regra isolada e testes de integracao validam colaboracao entre dominios.
7. Evidencias devem apontar dominio, requisito e cenario.

## 8. Atributos de qualidade atendidos pela arquitetura

| Atributo | Como a arquitetura ajuda |
|---|---|
| Testabilidade | Regras ficam isoladas por dominio e nivel de teste. |
| Manutenibilidade | Arquivos que mudam pelo mesmo motivo ficam proximos. |
| Rastreabilidade | Requisito, endpoint, tela e teste podem ser ligados ao mesmo dominio. |
| Evolucao independente | Frontend e backend possuem fronteiras claras via API. |
| Auditabilidade | Falhas e eventos sensiveis tem contexto proprio. |

## 9. Limites arquiteturais

Nao entram nesta arquitetura inicial:

- microservicos;
- mensageria distribuida;
- autenticação e autorizacao completas;
- multi-tenant de producao;
- observabilidade de nuvem completa;
- gateway de pagamento real.

Esses temas so devem entrar quando houver requisito, teste e evidencia que justifiquem o custo.
