# 01 - Visao, Escopo e Feature

## 1. Objetivo

Definir o contexto do sistema **Raizes do Nordeste**, o recorte de Qualidade de Software e a feature usada para transformar risco em requisito, teste e evidencia.

## 2. Contexto do negocio

A rede cresceu para diferentes unidades e precisa padronizar a experiencia digital sem ignorar variacoes de cardapio, operacao e sazonalidade. O sistema deve apoiar pedidos em canais digitais, funcionar bem em celular, tratar falhas de pagamento, gerar rastreabilidade e respeitar privacidade.

O problema central e:

> Como manter uma experiencia confiavel, segura, usavel, rastreavel e performatica em um sistema de franquias com multiplas unidades e regras locais?

## 3. Objetivos do projeto

| Objetivo | Resultado esperado |
|---|---|
| QA | Planejar e evidenciar qualidade antes e durante a implementacao. |
| Produto | Validar um fluxo critico do cliente sem expandir para o sistema completo. |
| Tecnico | Construir uma fatia vertical testavel com frontend, API, persistencia e testes. |
| Academico | Cobrir requisitos, criterios, testes, metricas, LGPD, conclusao e evidencias do roteiro. |

## 4. Escopo

### Dentro do escopo

- analise de riscos;
- requisitos funcionais, nao funcionais e requisitos de qualidade mensuraveis;
- criterios de aceitacao;
- feature principal de pedido para retirada;
- arquitetura modular do backend e do frontend;
- contrato de API, modelagem de dados e LGPD;
- plano de QA, cenarios, rastreabilidade, metricas e evidencias;
- implementacao minima e testes automatizados iniciais.

### Fora do escopo

- sistema completo de franquias em producao;
- gateway real de pagamento;
- estoque, fiscal, ERP e operacao real da cozinha;
- programa completo de fidelidade;
- painel administrativo completo;
- marketing, operacao comercial e infraestrutura fisica.

## 5. Premissas

- O uso predominante e mobile.
- O cardapio varia por unidade e pode variar por sazonalidade.
- Pagamento e uma integracao simulada com retornos controlados.
- Dados pessoais devem ser minimizados.
- Toda validacao relevante deve poder ser ligada a uma evidencia.

## 6. Atores

| Ator | Interesse principal | Ponto de QA |
|---|---|---|
| Cliente | Pedido rapido, status claro e privacidade. | Usabilidade, desempenho, responsividade e mensagens. |
| Unidade, cozinha e atendente | Pedido correto e baixo retrabalho. | Regras de disponibilidade, status e integracao. |
| Matriz/franqueadora | Padronizacao e indicadores. | Rastreabilidade, metricas e auditoria. |
| Pagamento simulado | Retorno previsivel para o fluxo. | Aprovacao, negativa e falha controlada. |
| Desenvolvimento e QA | Solucao testavel e rastreavel. | Arquitetura, cobertura e evidencias. |
| Responsavel por privacidade | Uso adequado de dados. | Consentimento, minimizacao e logs seguros. |

## 7. Feature principal

A feature escolhida e:

> **Pedido para retirada rapida com pagamento simulado.**

Ela concentra diferencas entre unidades, jornada mobile, validacao de itens, integracao externa, cenarios de falha, status do pedido, auditoria e oportunidades de aplicar LGPD.

### Fluxo principal

1. O cliente seleciona uma unidade ativa.
2. O sistema mostra o cardapio disponivel nessa unidade.
3. O cliente escolhe produtos e quantidades.
4. O sistema valida disponibilidade e monta a revisao.
5. O cliente confirma o pedido.
6. O pagamento simulado retorna `APROVADO`.
7. O pedido e confirmado e o status fica visivel para retirada.

### Fluxos alternativos

| Fluxo | Comportamento esperado |
|---|---|
| Pagamento negado | O pedido nao e confirmado e a interface explica o resultado. |
| Falha no pagamento | O sistema devolve erro controlado, gera rastreio e preserva a experiencia. |
| Produto indisponivel | O item nao entra em pedido valido. |
| Pedido vazio ou quantidade invalida | A confirmacao e bloqueada com mensagem clara. |
| Clique repetido | A idempotencia ou bloqueio equivalente evita duplicidade. |

## 8. Regras de negocio iniciais

| ID | Regra |
|---|---|
| RN-01 | O cliente seleciona a unidade antes de consumir o cardapio. |
| RN-02 | O cardapio exibe apenas produtos disponiveis na unidade. |
| RN-03 | Um pedido valido possui ao menos um item. |
| RN-04 | Quantidades devem ser maiores que zero. |
| RN-05 | O pedido so e confirmado com pagamento simulado aprovado. |
| RN-06 | Falhas de pagamento devem ser tratadas e auditaveis. |
| RN-07 | O status do pedido deve refletir o resultado do fluxo. |
| RN-08 | A jornada nao deve criar pedidos duplicados por repeticao de acao. |

## 9. Riscos prioritarios

| ID | Risco | Impacto | Mitigacao inicial |
|---|---|---|---|
| R-01 | Produto indisponivel aparece para a unidade errada. | Alto | Filtragem por unidade e teste negativo. |
| R-02 | Pedido com item invalido ou quantidade zerada. | Medio | Validacao de entrada e testes de regra. |
| R-03 | Duplicidade por clique repetido ou instabilidade. | Alto | Idempotencia e regressao. |
| R-04 | Pedido confirmado sem pagamento aprovado. | Alto | Estados controlados e integracao testada. |
| R-05 | Falha de pagamento sem tratamento. | Alto | Erro amigavel, auditoria e rastreio. |
| R-06 | Status inconsistente. | Alto | Regras de transicao e consulta testada. |
| R-07 | Lentidao em horario de pico. | Alto | Meta P95 e teste de carga. |
| R-08 | Experiencia mobile confusa. | Medio | Validacao de fluxo e viewports alvo. |
| R-09 | Evento critico sem evidencia. | Medio | Logs e matriz de rastreabilidade. |
| R-10 | Coleta ou exposicao excessiva de dados. | Alto | LGPD no fluxo, logs e testes. |

## 10. Papel de QA

QA atua como pratica preventiva e verificavel. O projeto nao mede qualidade pelo volume de codigo, mas pela capacidade de justificar cada teste, localizar cada responsabilidade e demonstrar o resultado com evidencia.
