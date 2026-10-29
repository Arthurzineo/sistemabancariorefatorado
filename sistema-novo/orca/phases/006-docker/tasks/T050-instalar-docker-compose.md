---
id: T050
phase: P006
title: Instalar o plugin docker compose no ambiente
status: completed
owner: claude
contract_id: null
depends_on: []
review_required: false
security_review_required: false
---

# T050 — Instalar o plugin docker compose no ambiente

## Objetivo
Plugin ausente em 2026-10-22 (docs/infra-docker.md).

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] `docker compose version` funciona (v5.6.1)

## Componentes afetados
ambiente

## Dependências
nenhuma

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
2026-10-22: compose v5.6.1 instalado em ~/.docker/cli-plugins/docker-compose (sha256 conferido com checksums.txt oficial). Limitação: o daemon exige o grupo docker (usuário fora do grupo; sem sudo). Ver ADR-013.
