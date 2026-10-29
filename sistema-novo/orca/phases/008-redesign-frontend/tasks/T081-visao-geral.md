---
id: T081
phase: P008
title: Visão geral (saldo total e resumos)
status: completed
owner: codex
contract_id: C-20261023-004
depends_on: [T080]
review_required: true
security_review_required: false
---

# T081 — Visão geral (saldo total e resumos)

## Objetivo
Tela Visão geral (§4): saldo total das contas ativas, cartões-resumo de clientes e contas, atalhos e contas com maior saldo.

## Escopo
Conforme `docs/design-frontend.md` (seções indicadas). Somente `sistemabancariorefatorado/frontend/**`.

## Não-objetivos
Backend, API, Docker (exceto se o build do frontend exigir).

## Critérios de aceite
- [x] Saldo total calculado a partir de GET /api/contas e formatado em BRL
- [x] Contagens de ativos/inativos corretas (testes com MSW)
- [x] Atalhos levam às seções certas
- [x] Estados de carregamento (Skeleton) e vazio (EmptyState)

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
