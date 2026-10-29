---
id: P004
title: API REST (controllers) e BDD
status: completed
owner: claude
depends_on: [P003]
---

# Fase P004 — API REST (controllers) e BDD

## Propósito
Expor os casos de uso pela API REST e portar os cenários BDD.

## Resultado esperado
API conforme docs/api.md; 15 cenários godog verdes; composition root funcionando.

## Critérios de entrada
Casos de uso prontos (T015) e adapter SQLite (T020).

## Critérios de saída
httptest + godog verdes; `go run ./cmd/api` serve a API.

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T030 | Handlers REST, DTOs e mapeamento de erros | completed | codex |
| T031 | main.go: config, injeção de dependências e health | completed | codex |
| T032 | Portar os 5 .feature para godog (15 cenários) | completed | codex |

## Dependências
P003

## Riscos
- Mapeamento erro → status inconsistente → tabela única em adapters/http/erros.go.

## Decisões da fase
Ver `docs/decisoes.md`.
