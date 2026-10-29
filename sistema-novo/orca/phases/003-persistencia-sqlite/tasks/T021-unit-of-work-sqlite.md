---
id: T021
phase: P003
title: Transferência atômica com Unit of Work no SQLite
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T020, T015]
review_required: true
security_review_required: false
---

# T021 — Transferência atômica com Unit of Work no SQLite

## Objetivo
Transação envolvendo débito e crédito; rollback em erro.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Teste: falha no meio não altera nenhum saldo

## Componentes afetados
sistemabancariorefatorado/backend/internal/adapters/sqlite/unit_of_work.go

## Dependências
T020, T015

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #2 mergeado em main (f9cddb1) em 2026-10-22; reviews P003-PR2-rodada1/2 + verificação final do Chief (fc6f74b).
