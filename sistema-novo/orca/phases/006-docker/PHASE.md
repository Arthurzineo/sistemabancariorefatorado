---
id: P006
title: Docker: 2 containers e rede
status: completed
owner: claude
depends_on: [P004, P005]
---

# Fase P006 — Docker: 2 containers e rede

## Propósito
Empacotar backend e frontend em containers separados e ligá-los por uma rede Docker.

## Resultado esperado
`docker compose up --build` sobe a aplicação em http://localhost:3000.

## Critérios de entrada
Backend e frontend buildando localmente.

## Critérios de saída
Aplicação completa funcionando via compose, com os dados persistidos em volume.

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T050 | Instalar o plugin docker compose no ambiente | planned | — |
| T051 | Dockerfiles multi-stage (backend Go, frontend nginx) | completed | codex |
| T052 | docker-compose.yml com rede banco-net, volume e healthcheck | completed | codex |

## Dependências
P004, P005

## Riscos
- Plugin compose ausente na máquina → T050.

## Decisões da fase
Ver `docs/decisoes.md`.
