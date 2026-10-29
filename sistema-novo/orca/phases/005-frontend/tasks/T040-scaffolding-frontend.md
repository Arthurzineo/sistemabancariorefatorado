---
id: T040
phase: P005
title: Projeto Vite + React (JS), Vitest, RTL e MSW
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T004]
review_required: true
security_review_required: false
---

# T040 — Projeto Vite + React (JS), Vitest, RTL e MSW

## Objetivo
Estrutura de docs/arquitetura.md §3; proxy /api no vite.config.js.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] `npm run dev`, `npm test` e `npm run build` funcionam

## Componentes afetados
sistemabancariorefatorado/frontend/

## Dependências
T004

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #4 mergeado em main em 2026-10-23 (26 testes Vitest/MSW, build ok); reviews P005-PR4-rodada1/2 + 3 pedidos de mudança do Chief.
