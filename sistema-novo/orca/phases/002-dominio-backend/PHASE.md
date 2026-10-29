---
id: P002
title: Domínio e casos de uso em Go (TDD/DDD)
status: completed
owner: claude
depends_on: [P001]
---

# Fase P002 — Domínio e casos de uso em Go (TDD/DDD)

## Propósito
Portar o domínio e os casos de uso para Go, com TDD, sem banco nem HTTP.

## Resultado esperado
internal/domain e internal/application completos, com repositório em memória e todos os testes de unidade do original portados.

## Critérios de entrada
P001 concluída.

## Critérios de saída
go test ./internal/... verde; testes originais de tdd/ e ddd/ portados (docs/estrategia-testes.md §5).

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T010 | Criar o módulo Go e a estrutura de pastas do backend | completed | codex |
| T011 | Entidade Cliente: idade 18..65 e situação (R03, R06) | completed | codex |
| T012 | Entidade ContaCorrente: saldo finito e situação (R09, R10) | completed | codex |
| T013 | Serviço de domínio Transferir com erros tipados (R12) | completed | codex |
| T014 | Portas de repositório, Unit of Work e adapter em memória | completed | codex |
| T015 | Casos de uso das 12 operações | completed | codex |

## Dependências
P001

## Riscos
- Diferenças sutis de float64 entre Java e Go → testar limites (NaN, Inf, overflow).

## Decisões da fase
Ver `docs/decisoes.md`.
