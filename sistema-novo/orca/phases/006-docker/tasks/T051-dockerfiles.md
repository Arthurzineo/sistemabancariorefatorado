---
id: T051
phase: P006
title: Dockerfiles multi-stage (backend Go, frontend nginx)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T031, T040]
review_required: true
security_review_required: true
---

# T051 — Dockerfiles multi-stage (backend Go, frontend nginx)

## Objetivo
Imagens pequenas, usuário não-root, nginx com proxy /api → backend:8080.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] As duas imagens buildam
- [ ] Containers rodam sem root

## Componentes afetados
sistemabancariorefatorado/backend/Dockerfile, sistemabancariorefatorado/frontend/Dockerfile, nginx.conf

## Dependências
T031, T040

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #5 mergeado em main (6cfcd35) em 2026-10-23; reviews P006-PR5-rodada1/2; verificação do Chief com docker compose (healthy, proxy, não-root, persistência, E2E 2x).
