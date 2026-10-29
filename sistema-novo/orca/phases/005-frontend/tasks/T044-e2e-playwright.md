---
id: T044
phase: P005
title: (Opcional) E2E com Playwright contra o compose
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T052]
review_required: true
security_review_required: false
---

# T044 — (Opcional) E2E com Playwright contra o compose

## Objetivo
Fluxo cadastro → transferência pela UI real. **Executada no PR da P006** (depende de T052).

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Pelo menos 1 fluxo E2E verde

## Componentes afetados
sistemabancariorefatorado/e2e/

## Dependências
T052

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #5 mergeado em main (6cfcd35) em 2026-10-23; reviews P006-PR5-rodada1/2; verificação do Chief com docker compose (healthy, proxy, não-root, persistência, E2E 2x).
