---
id: T020
phase: P003
title: DAOs SQLite de Cliente e Conta + migrations
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T014, T023]
review_required: true
security_review_required: false
---

# T020 — DAOs SQLite de Cliente e Conta + migrations

## Objetivo
modernc.org/sqlite (ADR-005), criação do schema, DAOs implementando as portas.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] tests/contract verde contra SQLite (arquivo temporário)
- [ ] Domínio não importa nada do sqlite

## Componentes afetados
sistemabancariorefatorado/backend/internal/adapters/sqlite/

## Dependências
T014

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #2 mergeado em main (f9cddb1) em 2026-10-22; reviews P003-PR2-rodada1/2 + verificação final do Chief (fc6f74b).
