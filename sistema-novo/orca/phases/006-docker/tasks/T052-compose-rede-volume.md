---
id: T052
phase: P006
title: docker-compose.yml com rede banco-net, volume e healthcheck
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T050, T051]
review_required: true
security_review_required: false
---

# T052 — docker-compose.yml com rede banco-net, volume e healthcheck

## Objetivo
Conforme docs/infra-docker.md.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Frontend chega ao backend pelo nome `backend`
- [ ] Dados sobrevivem a `docker compose restart`

## Componentes afetados
sistemabancariorefatorado/docker-compose.yml

## Dependências
T050, T051

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #5 mergeado em main (6cfcd35) em 2026-10-23; reviews P006-PR5-rodada1/2; verificação do Chief com docker compose (healthy, proxy, não-root, persistência, E2E 2x).
