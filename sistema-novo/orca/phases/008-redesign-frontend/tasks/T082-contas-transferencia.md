---
id: T082
phase: P008
title: Contas em cartões + transferência em 3 passos
status: completed
owner: codex
contract_id: C-20261023-004
depends_on: [T080]
review_required: true
security_review_required: false
---

# T082 — Contas em cartões + transferência em 3 passos

## Objetivo
Contas em grade de cartões com ações e Nova conta em dialog; Transferir em 3 passos: formulário → revisão → recibo (§4).

## Escopo
Conforme `docs/design-frontend.md` (seções indicadas). Somente `sistemabancariorefatorado/frontend/**`.

## Não-objetivos
Backend, API, Docker (exceto se o build do frontend exigir).

## Critérios de aceite
- [x] Todas as operações de conta mantidas (cadastrar, consultar, ativar, desativar, situação, remover com ConfirmDialog)
- [x] Transferência: selects de contas, validação inline (valor > 0, origem ≠ destino), revisão e recibo com saldos atualizados
- [x] Cada erro da API (incl. mesma_conta, id_invalido) exibido em pt-BR com caminho de correção
- [x] Testes de comportamento para cada caso

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
