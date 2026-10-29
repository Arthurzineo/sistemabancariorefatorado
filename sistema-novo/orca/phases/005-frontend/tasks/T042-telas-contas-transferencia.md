---
id: T042
phase: P005
title: Telas de contas e transferência (R08–R12)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T040, T030]
review_required: true
security_review_required: false
---

# T042 — Telas de contas e transferência (R08–R12)

## Objetivo
Consultar, cadastrar, situação, remover conta e transferir.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Testes para sucesso e para cada motivo de recusa da transferência

## Componentes afetados
sistemabancariorefatorado/frontend/src/features/contas/

## Dependências
T040, T030

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #4 mergeado em main em 2026-10-23 (26 testes Vitest/MSW, build ok); reviews P005-PR4-rodada1/2 + 3 pedidos de mudança do Chief.
