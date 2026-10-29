---
id: T013
phase: P002
title: Serviço de domínio Transferir com erros tipados (R12, ADR-011)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T012]
review_required: true
security_review_required: false
---

# T013 — Serviço de domínio Transferir com erros tipados (R12)

## Objetivo
TDD das 7 condições do R12 (docs/requisitos.md §3) com erros sentinela (ADR-010), incluindo origem/destino inativos (ADR-011).

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Os 7 testes de TransferenciaTest portados
- [ ] Nenhuma alteração de saldo quando recusada
- [ ] Testes novos: origem inativa e destino inativa são recusadas

## Componentes afetados
sistemabancariorefatorado/backend/internal/domain/conta/transferencia.go

## Dependências
T012

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`b68b6dc` (RED), `ac93765` (GREEN) — R12 com as 7 condições, incluindo ADR-011.
