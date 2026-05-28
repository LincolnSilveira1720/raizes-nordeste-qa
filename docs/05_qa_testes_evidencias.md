# 05 - QA, Testes e Evidencias

## 1. Objetivo

Definir a estrategia de Garantia da Qualidade e consolidar planejamento de testes, cenarios, rastreabilidade, metricas e evidencias.

## 2. Diretriz central

```text
risco -> requisito -> criterio de aceitacao -> teste -> evidencia -> metrica
```

Nenhum teste importante deve existir isolado dessa trilha. A prioridade vem do risco de negocio e da capacidade de observar o resultado.

## 3. Plano de QA

| Area | Aplicacao |
|---|---|
| Prevencao | Requisitos verificaveis, arquitetura clara e criterios antes de expandir codigo. |
| Validacao | Testes unitarios, integracao, sistema, regressao, aceitacao, usabilidade, desempenho, seguranca e mobile. |
| Evidencia | Prints, logs, relatorios, matriz e checklists. |
| Medicao | Cobertura, defeitos, P95, disponibilidade de referencia, satisfacao e MTTR. |

### Criterios de entrada

- feature, requisitos e criterios definidos;
- contrato de API e massa controlada disponiveis;
- ambiente local ou de homologacao executavel;
- matriz inicial de rastreabilidade pronta.

### Criterios de saida

- cenarios criticos executados;
- defeitos criticos corrigidos ou registrados;
- evidencias localizaveis;
- metricas minimas coletadas ou justificadas;
- LGPD e responsividade tratadas no recorte.

## 4. Niveis e tipos de teste

| Nivel ou tipo | Foco no projeto |
|---|---|
| Unitario | Regras de pedido, pagamento, disponibilidade e calculo. |
| Integracao | API, persistencia, pagamentos simulados, status e auditoria. |
| Sistema/E2E | Jornada de unidade ate status final. |
| Regressao | Fluxos criticos apos mudancas em pedidos, cardapio e pagamento. |
| Aceitacao/UAT | Leitura de negocio, mensagens e conclusao da tarefa. |
| Usabilidade | Etapas, clareza e revisao do pedido. |
| Desempenho | Cardapio e criacao de pedido sob carga. |
| Seguranca/LGPD | Entrada invalida, exposicao de dados e consentimento. |
| Responsividade | Viewports 360px, 390px e 430px. |

## 5. Cenarios de teste

| ID | Cenario | Tipo | Resultado esperado |
|---|---|---|---|
| CT-01 | Pedido aprovado. | Positivo | Pedido confirmado e status visivel. |
| CT-02 | Pagamento negado. | Negativo | Pedido nao confirmado e mensagem clara. |
| CT-03 | Falha de pagamento. | Negativo | Erro controlado e auditoria. |
| CT-04 | Produto indisponivel na unidade. | Negativo | Item rejeitado. |
| CT-05 | Pedido vazio. | Negativo | Confirmacao bloqueada. |
| CT-06 | Quantidade invalida. | Negativo | Validacao rejeita o item. |
| CT-07 | Consulta de status. | Positivo | Status atual retornado. |
| CT-08 | Clique duplicado. | Regressao | Um pedido valido reaproveitado. |
| CT-09 | Cardapio dentro da meta. | Desempenho | P95 conforme `RQ-01`. |
| CT-10 | Criacao de pedido dentro da meta. | Desempenho | P95 conforme `RQ-02`. |
| CT-11 | Fluxo mobile. | Responsividade | Sem quebra critica nos viewports alvo. |
| CT-12 | Consentimento aplicavel. | LGPD | Finalidade e registro coerentes. |

## 6. Matriz de rastreabilidade

| Requisito | Risco | Teste | Evidencia esperada | Status atual |
|---|---|---|---|---|
| RF-01, RF-02 | R-01 | CT-01, CT-04 | Fluxo local e teste de cardapio. | Validado na primeira fatia. |
| RF-05 | R-01 | CT-04 | Teste negativo de disponibilidade. | Validado na primeira fatia. |
| RF-06 | R-02 | CT-05 | Resposta de validacao. | Validado na primeira fatia. |
| RF-09 a RF-13 | R-04, R-05 | CT-01, CT-02, CT-03 | Status, erro e auditoria. | Validado em backend inicial. |
| RF-14 | R-06 | CT-07 | Consulta de status. | Validado na primeira fatia. |
| RF-16, RQ-03 | R-03 | CT-08 | Teste de idempotencia. | Validado na primeira fatia. |
| RQ-01, RQ-02 | R-07 | CT-09, CT-10 | Relatorio de carga. | Planejado. |
| RQ-06 | R-08 | CT-11 | Prints mobile ou E2E. | Evidencia formal pendente. |
| RQ-07 | R-10 | CT-12, LGPD-01 a LGPD-05 | Aviso, consentimento e checklist. | Evidencia formal pendente. |
| RQ-08 | R-05, R-09 | CT-03 | Rastreio de falha. | Validado em backend inicial. |

## 7. Automacao

| Area | Ferramentas | Cobertura prioritaria |
|---|---|---|
| Backend | `pytest`, Flask test client e `pytest-cov` | Regras unitarias e endpoints criticos. |
| Frontend | Vitest | Carrinho e tratamento de API. |
| E2E | Playwright | Jornada principal no navegador. |
| Carga | k6 | Cardapio e criacao de pedido. |

### Testes automatizados prioritarios

- pedido vazio;
- quantidade invalida;
- produto fora da unidade;
- pagamento aprovado, negado e com falha;
- status do pedido;
- idempotencia;
- jornada mobile aprovada;
- banner de erro e aviso de privacidade quando aplicavel.

## 8. Metricas

| Metrica | Meta inicial | Coleta |
|---|---|---|
| Taxa de defeitos criticos | `<= 2%` em referencia simulada. | Registro de defeitos. |
| Cobertura de testes | `>= 80%` nas regras criticas. | Relatorio de cobertura. |
| Tempo de resposta | P95 `<= 2s` em cardapio e pedido. | API ou k6. |
| Disponibilidade | `99,5%` como referencia. | Monitoramento ou justificativa de ambiente. |
| Satisfacao | `>= 85%` como meta de UAT/usabilidade. | Checklist ou avaliacao. |
| MTTR | `<= 24h` para defeito critico como meta teorica. | Registro de incidentes. |

## 9. Evidencias

### Estrutura recomendada

```text
evidencias/
  prints/
  relatorios/
    pytest/
    coverage/
    e2e/
    k6/
  logs/
  checklist/
  matriz/
```

### Padrao de nome

```text
<ID_TESTE>_<tipo>_<descricao_curta>_<data>.ext
```

Exemplos:

```text
CT-01_print_pedido_aprovado_2026-05-18.png
CT-03_log_falha_pagamento_2026-05-18.txt
CT-09_k6_cardapio_p95_2026-05-18.txt
LGPD-01_print_aviso_privacidade_2026-05-18.png
```

## 10. Validacoes ja observadas

| Validacao | Resultado observado |
|---|---|
| Backend com cobertura | 11 testes aprovados e 93% de cobertura total reportada. |
| Frontend unitario | 3 testes aprovados. |
| Build frontend | Build Vite concluido. |
| Playwright inicial | 1 jornada E2E aprovada. |
| Fluxo local integrado | Pedido exibido com status `CONFIRMADO`. |

Os relatorios finais ainda devem ser consolidados na pasta de evidencias para fortalecer a entrega.
