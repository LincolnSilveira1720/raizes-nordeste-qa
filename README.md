# Projeto QA — Raízes do Nordeste

Projeto desenvolvido para a disciplina **Projeto Multidisciplinar**, na trilha de **Qualidade de Software**, com base no estudo de caso da rede **Raízes do Nordeste**.

O objetivo do projeto é demonstrar uma abordagem estruturada de Garantia da Qualidade de Software aplicada a uma feature crítica do sistema: **pedido para retirada rápida com pagamento simulado**.

## Visão geral

A solução foi organizada para evidenciar:

- análise de requisitos funcionais e não funcionais;
- requisitos de qualidade mensuráveis;
- critérios de aceitação;
- estratégia de testes;
- plano de garantia da qualidade;
- rastreabilidade entre requisito, teste e evidência;
- validação de LGPD e privacidade;
- testes automatizados e documentação técnica.

## Recorte funcional

A feature escolhida para validação foi:

> Pedido para retirada rápida com pagamento simulado.

Esse recorte contempla seleção de unidade, exibição de cardápio por unidade, montagem do pedido, revisão dos itens, simulação de pagamento, consulta de status, tratamento de falhas, privacidade e evidências de qualidade.

## Estrutura do projeto

```text
raizes-nordeste-qa/
  docs/
  projeto/
    backend/
    frontend/
  README.md
  .gitignore
```

## Backend

O backend foi organizado de forma modular, separando responsabilidades por domínio.

Principais responsabilidades:

- unidades;
- cardápio;
- pedidos;
- pagamento simulado;
- auditoria;
- privacidade.

Tecnologias utilizadas:

- Python;
- Flask;
- SQLite;
- pytest;
- pytest-cov.

### Executar backend

```bash
cd projeto/backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m pytest --cov=app --cov-report=term-missing
python -m flask --app app run --host 127.0.0.1 --port 5000
```

## Frontend

O frontend foi estruturado com foco em organização, responsividade e clareza da jornada do usuário.

Tecnologias utilizadas:

- React;
- TypeScript;
- Vite;
- Vitest;
- Playwright.

### Executar frontend

```bash
cd projeto/frontend
npm install
npm test
npm run build
npm run test:e2e
npm run dev -- --host 127.0.0.1 --port 5173
```

## Testes e qualidade

Foram considerados os seguintes tipos de teste:

- testes unitários;
- testes de integração;
- testes de sistema/E2E;
- testes de regressão;
- testes negativos;
- testes de desempenho;
- testes de responsividade mobile;
- testes de LGPD e privacidade;
- testes de aceitação/usabilidade.

As evidências de execução, prints, métricas e resultados consolidados estão documentados no relatório final em PDF entregue no AVA/Univirtus.

## Documentação

A pasta `docs/` contém os documentos auxiliares do projeto, como visão geral, requisitos, arquitetura, plano de QA, testes e orientações de execução.

O documento principal de entrega acadêmica deve ser enviado separadamente em PDF único, conforme orientação do roteiro da atividade.

## Observações

Este projeto possui finalidade acadêmica e foi desenvolvido como estudo de caso para aplicação de práticas de Engenharia de Software e Garantia da Qualidade.

Não há integração com gateway real de pagamento, ambiente produtivo ou dados reais de clientes. O pagamento é simulado e os dados utilizados são controlados para fins de teste.

## Autor

**Lincoln Silveira**  
Curso: Análise e Desenvolvimento de Sistemas  
Trilha: Qualidade de Software
