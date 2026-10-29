---
id: P003
title: Persistência SQLite (adapter DAO)
status: completed
owner: claude
depends_on: [P002]
---

# Fase P003 — Persistência SQLite (adapter DAO)

## Propósito
Implementar o adapter SQLite das portas de repositório, trocável pelo adapter em memória.

## Resultado esperado
DAOs SQLite passando a mesma suíte de contrato que o adapter em memória; transferência atômica.

## Critérios de entrada
Portas definidas (T014).

## Critérios de saída
Suíte de contrato verde para memory e sqlite.

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T023 | Completar T014 — persistir alterações, Unit of Work e suíte de contrato | completed | codex |
| T020 | DAOs SQLite de Cliente e Conta + migrations | completed | codex |
| T021 | Transferência atômica com Unit of Work no SQLite | completed | codex |
| T022 | Seed dos dados iniciais (Maria, Felipe, contas 1 e 2) | completed | codex |

## Dependências
P002

## Riscos
- Concorrência no SQLite (um escritor) → transação curta e busy_timeout.

## Decisões da fase
Ver `docs/decisoes.md`.
