---
id: P005
title: Frontend React (Vite) e testes de frontend
status: completed
owner: claude
depends_on: [P004]
---

# Fase P005 — Frontend React (Vite) e testes de frontend

## Propósito
Interface simples para usar as 12 operações, com testes.

## Resultado esperado
SPA React consumindo /api; testes de componente e integração com MSW.

## Critérios de entrada
Contrato da API estável (T030).

## Observação
T044 (E2E) foi movida para o PR da P006 por depender de T052; a fase foi fechada com T040–T043.

## Critérios de saída
`npm test` verde; todas as 12 operações utilizáveis pela UI.

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T040 | Projeto Vite + React (JS), Vitest, RTL e MSW | completed | codex |
| T041 | Telas de clientes (R01–R07) | completed | codex |
| T042 | Telas de contas e transferência (R08–R12) | completed | codex |
| T043 | Layout simples, responsivo e acessível | completed | codex |
| T044 | (Opcional) E2E com Playwright contra o compose | completed | codex |

## Dependências
P004

## Riscos
- Divergência entre o mock MSW e a API real → mocks derivados de docs/api.md; E2E opcional (T044).

## Decisões da fase
Ver `docs/decisoes.md`.
