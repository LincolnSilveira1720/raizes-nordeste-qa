# 06 - Execucao e Entrega

## 1. Objetivo

Registrar como executar o projeto, o estado atual da primeira fatia, o backlog controlado e a forma de montar a entrega final sem espalhar documentos de processo.

## 2. Estrutura do repositorio

```text
Atividade_Pratica - FINAL/
  docs/
    padrao/
    project/
      README.md
      01_visao_escopo_feature.md
      02_requisitos_qualidade.md
      03_arquitetura_modular.md
      04_api_dados_privacidade.md
      05_qa_testes_evidencias.md
      06_execucao_entrega.md
  projeto/
    README.md
    backend/
    frontend/
  evidencias/
```

O backend fica na pasta fisica `projeto/backend/`, alinhado ao documento final e a estrutura real da entrega.

## 3. Stack

| Area | Stack |
|---|---|
| Backend | Python, Flask, SQLite via `sqlite3`, pytest e pytest-cov. |
| Frontend | React, TypeScript, Vite, CSS organizado, Lucide React, Vitest e Playwright. |
| Qualidade complementar | k6 planejado para carga e evidencias manuais para LGPD/usabilidade. |

## 4. Execucao local

### Backend

```powershell
cd projeto\backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing
.\.venv\Scripts\python.exe -m flask --app app run --host 127.0.0.1 --port 5000
```

### Frontend

```powershell
cd projeto\frontend
npm.cmd install
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

## 5. Estado da primeira fatia

| Area | Entregue |
|---|---|
| Backend | API Flask, seed SQLite, pedido, pagamento simulado, status, idempotencia e auditoria basica. |
| Frontend | Selecao de unidade, cardapio, revisao, status e tratamento visual de erros. |
| Testes | Backend unitario/integracao, Vitest inicial e E2E aprovado inicial. |
| Documentacao | Visao, requisitos, arquitetura, API, dados, privacidade, QA e entrega consolidados. |
| Arquitetura no codigo | Backend por modulos de dominio e frontend por page, sections e features aplicados. |

### Endpoints ja exercitados

```text
GET  /api/health
GET  /api/unidades
GET  /api/unidades/{id}/cardapio
POST /api/pedidos
GET  /api/pedidos/{id}/status
POST /api/pagamentos/simular
```

## 6. Pendencias controladas

| Pendencia | Motivo |
|---|---|
| E2E negativo para pagamento negado e pedido vazio | Ampliar regressao visual. |
| Evidencias formais em `evidencias/` | Tornar validacoes anexaveis. |
| Prints em 360px, 390px e 430px | Comprovar responsividade. |
| Scripts k6 | Comprovar `RQ-01` e `RQ-02`. |
| Checklists de LGPD e usabilidade | Fechar validacao manual. |
| Regressao visual da jornada modular | Confirmar a page de retirada apos cada evolucao relevante. |

## 7. Backlog resumido

| Frente | Proximo resultado |
|---|---|
| Arquitetura | Novas features seguindo os dominios e sections ja aplicados. |
| Testes | Cobertura de cenarios negativos e carga minima. |
| Evidencias | Relatorios, prints, logs e checklists nomeados pela matriz. |
| Entrega | PDF final com narrativa enxuta e anexos relevantes. |

## 8. Checklist de maturidade

| Item | Status |
|---|---|
| Contexto, escopo e feature definidos. | Fechado |
| Requisitos funcionais e nao funcionais definidos. | Fechado |
| Oito requisitos de qualidade mensuraveis definidos. | Fechado |
| Arquitetura modular oficial descrita. | Fechado |
| Contrato da API e modelagem minima definidos. | Fechado |
| Plano de QA, cenarios e matriz registrados. | Fechado |
| Backend e frontend organizados na arquitetura modular. | Fechado |
| Implementacao minima executavel existente. | Fechado |
| Testes automatizados iniciais executados. | Parcial com evidencia a consolidar |
| Carga, responsividade formal, LGPD e UAT evidenciados. | Pendente |

## 9. Conformidade com o roteiro

| Exigencia | Onde esta |
|---|---|
| Introducao, objetivos e escopo | `01_visao_escopo_feature.md` |
| Feature e riscos | `01_visao_escopo_feature.md` |
| RF, RNF, qualidade mensuravel e criterios | `02_requisitos_qualidade.md` |
| Arquitetura | `03_arquitetura_modular.md` |
| API, dados e LGPD | `04_api_dados_privacidade.md` |
| QA Plan, testes, 10+ cenarios, metricas e rastreabilidade | `05_qa_testes_evidencias.md` |
| Execucao, evidencias, maturidade e conclusao | Este documento |

## 10. Estrutura sugerida do PDF final

1. Capa e sumario.
2. Introducao, objetivos e contexto.
3. Escopo, atores, feature e riscos.
4. Requisitos, qualidade mensuravel e criterios de aceitacao.
5. Arquitetura modular, API, dados e privacidade.
6. Estrategia de QA, plano de testes, cenarios, matriz e metricas.
7. Implementacao minima e validacoes executadas.
8. Evidencias anexadas.
9. Riscos residuais e conclusao.

## 11. Conclusao

O projeto mede maturidade pela clareza da trilha de qualidade. A implementacao existe para provar comportamento critico, enquanto a documentacao mantem cada decisao conectada a risco, requisito, arquitetura, teste e evidencia.
