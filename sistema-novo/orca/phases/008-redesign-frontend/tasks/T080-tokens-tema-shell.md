---
id: T080
phase: P008
title: Tokens, tema claro/escuro, app shell e componentes base
status: completed
owner: codex
contract_id: C-20261023-004
depends_on: []
review_required: true
security_review_required: false
---

# T080 — Tokens, tema claro/escuro, app shell e componentes base

## Objetivo
Criar tokens.css, tema claro/escuro (§2), app shell com navegação lateral/inferior (§3) e componentes base (§5: Button, Card, StatCard, StatusChip, Field, Select, Dialog, ConfirmDialog, Toast, EmptyState, Skeleton, Icon) + lib/formato.js e lib/erros.js (§6).

## Escopo
Conforme `docs/design-frontend.md` (seções indicadas). Somente `sistemabancariorefatorado/frontend/**`.

## Não-objetivos
Backend, API, Docker (exceto se o build do frontend exigir).

## Critérios de aceite
- [x] Componentes só usam tokens semânticos
- [x] Alternância de tema funciona e é lembrada (localStorage em try/catch)
- [x] Testes de cada componente base (renderização, estados, acessibilidade)
- [x] formatarMoeda e mensagens de erro em pt-BR com testes

## Componentes afetados
frontend/src/**, frontend/tests/**, frontend/e2e/**

## Dependências
[]

## Restrições
- Sem novas dependências de runtime (ADR-020); versões exatas (ADR-017).
- TDD: teste RED antes de cada componente/tela; clean code (arquivos pequenos, um componente por arquivo).

## Testes
Vitest + RTL + MSW; Playwright para o fluxo completo.

## Evidência de conclusão
PR #8 mergeado em main em 2026-10-23 (07a007f): 33 testes Vitest, build, compose e E2E 2x verificados pelo Chief; 24 capturas revisadas.
