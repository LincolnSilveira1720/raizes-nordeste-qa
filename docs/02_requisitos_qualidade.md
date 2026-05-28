# 02 - Requisitos e Qualidade

## 1. Objetivo

Consolidar requisitos funcionais, requisitos nao funcionais, oito requisitos de qualidade mensuraveis e criterios de aceitacao da feature **Pedido para retirada rapida com pagamento simulado**.

## 2. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Permitir selecao de unidade antes do pedido. | Alta |
| RF-02 | Exibir cardapio da unidade selecionada. | Alta |
| RF-03 | Permitir adicionar produtos disponiveis ao pedido. | Alta |
| RF-04 | Permitir ajustar quantidade antes da confirmacao. | Media |
| RF-05 | Rejeitar produto indisponivel para a unidade. | Alta |
| RF-06 | Impedir pedido vazio. | Alta |
| RF-07 | Exibir revisao com itens, quantidades e total. | Alta |
| RF-08 | Calcular o valor total a partir dos itens validos. | Alta |
| RF-09 | Solicitar pagamento simulado apos confirmacao. | Alta |
| RF-10 | Registrar retorno `APROVADO`, `NEGADO` ou `FALHA`. | Alta |
| RF-11 | Confirmar pedido apenas com pagamento aprovado. | Alta |
| RF-12 | Exibir mensagem clara para pagamento negado. | Alta |
| RF-13 | Exibir mensagem clara e rastreavel para falha de pagamento. | Alta |
| RF-14 | Permitir consulta de status do pedido. | Alta |
| RF-15 | Registrar eventos relevantes de auditoria. | Media |
| RF-16 | Evitar duplicidade na confirmacao. | Alta |
| RF-17 | Exibir aviso de privacidade quando houver uso de dados pessoais. | Alta |
| RF-18 | Registrar consentimento quando aplicavel. | Alta |

## 3. Requisitos nao funcionais

| ID | Dimensao | Meta inicial |
|---|---|---|
| RNF-01 | Desempenho do cardapio | P95 ate 2 segundos. |
| RNF-02 | Desempenho da criacao de pedido | P95 ate 2 segundos. |
| RNF-03 | Disponibilidade | 99,5% mensal como referencia. |
| RNF-04 | Usabilidade | Ate 3 etapas principais apos a escolha dos produtos. |
| RNF-05 | Responsividade | Fluxo valido em 360px, 390px e 430px. |
| RNF-06 | Confiabilidade | Zero pedidos duplicados no cenario testado. |
| RNF-07 | Seguranca | Sem exposicao desnecessaria de dados pessoais. |
| RNF-08 | LGPD | Finalidade clara e consentimento quando aplicavel. |
| RNF-09 | Observabilidade | Falhas simuladas registradas em log ou auditoria. |
| RNF-10 | Manutenibilidade | Regras criticas testaveis isoladamente. |
| RNF-11 | Escalabilidade planejada | Carga de referencia com ate 500 usuarios. |
| RNF-12 | Acessibilidade basica | Controles e mensagens compreensiveis. |

## 4. Requisitos de qualidade mensuraveis

| ID | Dimensao | Meta | Evidencia esperada |
|---|---|---|---|
| RQ-01 | Desempenho do cardapio | P95 `<= 2s` | Relatorio de API ou carga. |
| RQ-02 | Desempenho do pedido | P95 `<= 2s` | Relatorio de API ou carga. |
| RQ-03 | Confiabilidade | 0 duplicidades no cenario testado. | Teste de idempotencia e registro persistido. |
| RQ-04 | Funcionalidade | 0 inconsistencias no cardapio testado. | Caso de unidade e produto indisponivel. |
| RQ-05 | Usabilidade | Ate 3 etapas principais apos selecao de produtos. | Checklist e print da jornada. |
| RQ-06 | Responsividade | Sem quebra critica nos viewports alvo. | Prints ou relatorio E2E. |
| RQ-07 | Seguranca e LGPD | Checklist obrigatorio atendido. | Aviso, consentimento e logs revisados. |
| RQ-08 | Observabilidade | 100% das falhas simuladas rastreadas. | Evento de auditoria e mensagem ao cliente. |

## 5. Criterios de aceitacao

| ID | Dado | Quando | Entao |
|---|---|---|---|
| CA-01 | Cliente no inicio do fluxo. | Seleciona unidade ativa. | O cardapio correspondente fica disponivel. |
| CA-02 | Unidade selecionada. | Cardapio e carregado. | Apenas produtos disponiveis aparecem. |
| CA-03 | Produto fora do cardapio da unidade. | Cliente tenta usa-lo no pedido. | Inclusao e rejeitada com mensagem. |
| CA-04 | Carrinho vazio. | Cliente tenta confirmar. | Pedido nao e criado. |
| CA-05 | Item com quantidade `<= 0`. | Pedido e validado. | Quantidade e rejeitada. |
| CA-06 | Pedido valido. | Cliente revisa antes de pagar. | Itens, quantidades e total sao exibidos. |
| CA-07 | Pedido valido. | Pagamento retorna `APROVADO`. | Pedido fica confirmado. |
| CA-08 | Pedido valido. | Pagamento retorna `NEGADO`. | Pedido nao e confirmado e a mensagem e clara. |
| CA-09 | Pagamento falha. | Fluxo trata a falha. | Cliente recebe erro controlado e auditoria e registrada. |
| CA-10 | Pedido criado. | Status e consultado. | Estado atual e retornado de forma compreensivel. |
| CA-11 | Carga medida no cardapio. | Requisicoes sao processadas. | P95 fica dentro da meta ou o desvio e justificado. |
| CA-12 | Jornada mobile executada. | Viewport alvo e usado. | Botoes, textos e resumo ficam acionaveis e legiveis. |
| CA-13 | Acao de confirmacao repetida. | Backend processa a chave de idempotencia. | Um unico pedido valido e reaproveitado. |
| CA-14 | Dado pessoal e solicitado. | Cliente avanca no fluxo. | Finalidade e consentimento aplicavel ficam claros. |

## 6. Mensagens de referencia

| Situacao | Mensagem |
|---|---|
| Pedido vazio | `Adicione pelo menos um item para continuar.` |
| Quantidade invalida | `A quantidade deve ser maior que zero.` |
| Produto indisponivel | `Este produto nao esta disponivel na unidade selecionada.` |
| Pagamento negado | `Pagamento nao aprovado. Revise os dados ou tente outra forma de pagamento.` |
| Falha no pagamento | `Nao foi possivel concluir o pagamento agora. Tente novamente em instantes.` |

## 7. Prioridade da primeira fatia

A implementacao minima deve cobrir primeiro `RF-01`, `RF-02`, `RF-03`, `RF-05`, `RF-06`, `RF-07`, `RF-09`, `RF-10`, `RF-11`, `RF-14`, `RF-16` e os requisitos de qualidade `RQ-03`, `RQ-04` e `RQ-08`. Os demais requisitos continuam documentados para orientar evidencias, evolucao e validacoes complementares.
