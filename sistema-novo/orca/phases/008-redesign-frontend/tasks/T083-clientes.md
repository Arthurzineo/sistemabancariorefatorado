---
id: T083
phase: P008
title: Clientes em tabela, dialogs e confirmação de remoção
status: completed
owner: codex
contract_id: C-20261023-004
depends_on: [T080]
review_required: true
security_review_required: false
---

# T083 — Clientes em tabela, dialogs e confirmação de remoção

## Objetivo
Clientes em tabela (desktop) / cartões (mobile), Novo cliente em dialog com validação de idade inline, busca por id, ações com chips de situação (§4).

## Escopo
Conforme `docs/design-frontend.md` (seções indicadas). Somente `sistemabancariorefatorado/frontend/**`.

## Não-objetivos
Backend, API, Docker (exceto se o build do frontend exigir).

## Critérios de aceite
- [x] Todas as operações de cliente mantidas (listar, consultar, cadastrar, validar idade, ativar, desativar, situação, remover com ConfirmDialog)
- [x] Validação inline de idade 18–65 e de nome/e-mail
- [x] Testes de comportamento para cada caso (os existentes migrados sem perder casos)

## Componentes afetados
frontend/src/**, frontend/tests/**, frontend/e2e/**

## Dependências
[T080]

## Restrições
- Sem novas dependências de runtime (ADR-020); versões exatas (ADR-017).
- TDD: teste RED antes de cada componente/tela; clean code (arquivos pequenos, um componente por arquivo).

## Testes
Vitest + RTL + MSW; Playwright para o fluxo completo.

## Evidência de conclusão
PR #8 mergeado em main em 2026-10-23 (07a007f): 33 testes Vitest, build, compose e E2E 2x verificados pelo Chief; 24 capturas revisadas.
