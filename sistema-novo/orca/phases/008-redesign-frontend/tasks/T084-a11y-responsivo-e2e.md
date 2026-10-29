---
id: T084
phase: P008
title: Acessibilidade/responsividade, E2E com capturas
status: completed
owner: codex
contract_id: C-20261023-004
depends_on: [T081, T082, T083]
review_required: true
security_review_required: false
---

# T084 — Acessibilidade/responsividade, E2E com capturas

## Objetivo
Passada final de acessibilidade e responsividade (§7) e E2E atualizado com capturas de tela.

## Escopo
Conforme `docs/design-frontend.md` (seções indicadas). Somente `sistemabancariorefatorado/frontend/**`.

## Não-objetivos
Backend, API, Docker (exceto se o build do frontend exigir).

## Critérios de aceite
- [x] Alvos ≥ 44px, focus-visible, skip link, aria-current na navegação, sem rolagem horizontal a 320px
- [x] prefers-reduced-motion respeitado
- [x] E2E do fluxo completo (criar conta, criar cliente, transferir com revisão e recibo) verde 2x seguidas
- [x] Capturas em frontend/e2e/screenshots/: visão geral, contas, clientes, transferir (revisão e recibo), em claro e escuro, 1280px e 390px

## Componentes afetados
frontend/src/**, frontend/tests/**, frontend/e2e/**

## Dependências
[T081, T082, T083]

## Restrições
- Sem novas dependências de runtime (ADR-020); versões exatas (ADR-017).
- TDD: teste RED antes de cada componente/tela; clean code (arquivos pequenos, um componente por arquivo).

## Testes
Vitest + RTL + MSW; Playwright para o fluxo completo.

## Evidência de conclusão
PR #8 mergeado em main em 2026-10-23 (07a007f): 33 testes Vitest, build, compose e E2E 2x verificados pelo Chief; 24 capturas revisadas.
