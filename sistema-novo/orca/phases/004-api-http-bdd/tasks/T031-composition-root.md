---
id: T031
phase: P004
title: main.go: config, injeção de dependências e health
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T030, T022]
review_required: true
security_review_required: false
---

# T031 — main.go: config, injeção de dependências e health

## Objetivo
Ler DB_PATH, SEED e PORT; montar adapters; GET /api/health; shutdown gracioso.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] `go run ./cmd/api` responde em /api/health

## Componentes afetados
sistemabancariorefatorado/backend/cmd/api/, internal/config/

## Dependências
T030, T022

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #3 mergeado em main em 2026-10-23; review P004-PR3-rodada1 approved; verificação do Chief (curl + restart).
