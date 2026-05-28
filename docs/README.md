# Documentacao do Projeto Raizes do Nordeste

## Fonte de verdade

Esta pasta concentra a documentacao canônica do projeto de Qualidade de Software para a feature **Pedido para retirada rapida com pagamento simulado**.

A arquitetura modular descrita aqui e a arquitetura oficial do projeto: backend, frontend, testes e evidencias devem evoluir a partir dessa organizacao.

## Como navegar

| Documento | Responsabilidade |
|---|---|
| [`01_visao_escopo_feature.md`](./01_visao_escopo_feature.md) | Contexto, objetivos, escopo, atores, feature principal e riscos. |
| [`02_requisitos_qualidade.md`](./02_requisitos_qualidade.md) | Requisitos funcionais, nao funcionais, qualidade mensuravel e criterios de aceite. |
| [`03_arquitetura_modular.md`](./03_arquitetura_modular.md) | Dominios, estrutura de backend/frontend, fronteiras e decisoes arquiteturais. |
| [`04_api_dados_privacidade.md`](./04_api_dados_privacidade.md) | Contrato da API, modelagem de dados, estados e diretrizes de LGPD. |
| [`05_qa_testes_evidencias.md`](./05_qa_testes_evidencias.md) | Estrategia de QA, plano de testes, cenarios, rastreabilidade, metricas e evidencias. |
| [`06_execucao_entrega.md`](./06_execucao_entrega.md) | Setup, estado da implementacao, backlog controlado, checklist e montagem da entrega. |

Os arquivos em `docs/padrao/` sao referencias do roteiro e do estudo de caso. Eles nao substituem os documentos canônicos desta pasta.

## Diretrizes de organizacao

1. Um assunto deve ter uma fonte principal. Evite criar um documento novo quando uma secao no documento correto resolver o problema.
2. Requisitos, testes e evidencias devem manter a trilha `risco -> requisito -> criterio -> teste -> evidencia -> metrica`.
3. Arquitetura, endpoints, telas e testes devem ser localizaveis por dominio: unidades, cardapio, pedidos, pagamentos, auditoria e privacidade.
4. Documentos temporarios de revisao, migracao ou montagem nao devem virar uma segunda trilha paralela.
5. Quando o escopo crescer de verdade, um documento pode ser desmembrado, mas o indice deve continuar apontando para uma unica fonte de verdade.

## Recorte atual

O projeto demonstra QA aplicado a uma fatia vertical pequena:

- backend Flask com persistencia SQLite;
- frontend React com TypeScript e fluxo mobile-first;
- pagamento simulado para exercitar cenarios positivos e negativos;
- testes automatizados backend, frontend e E2E inicial;
- evidencias planejadas para carga, responsividade, LGPD e rastreabilidade.

O sistema completo de franquias, gateway real de pagamento, ERP, estoque real, operacao comercial e infraestrutura de producao permanecem fora do recorte.
