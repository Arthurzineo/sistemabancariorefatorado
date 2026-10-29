---
id: T032
phase: P004
title: Portar os 5 .feature para godog (15 cenários)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T015]
review_required: true
security_review_required: false
---

# T032 — Portar os 5 .feature para godog (15 cenários)

## Objetivo
Features em português (ADR-006); steps chamando a camada de aplicação.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] 15 cenários verdes + cenários de transferência com conta inativa (ADR-011)
- [ ] Novos cenários para situação/remoção e motivos de transferência

## Componentes afetados
sistemabancariorefatorado/backend/features/, tests/bdd/

## Dependências
T015

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #3 mergeado em main em 2026-10-23; review P004-PR3-rodada1 approved; verificação do Chief (curl + restart).
