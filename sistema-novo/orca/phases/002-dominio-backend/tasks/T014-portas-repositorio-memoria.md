---
id: T014
phase: P002
title: Portas de repositório, Unit of Work e adapter em memória
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T011, T012]
review_required: true
security_review_required: false
---

# T014 — Portas de repositório, Unit of Work e adapter em memória

## Objetivo
Definir as interfaces em application/ports e o adapter memory; unicidade de id; listagem como cópia.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] UnicidadeIdentificadorTest portado
- [ ] Suíte de contrato em tests/contract rodando contra memory

## Componentes afetados
sistemabancariorefatorado/backend/internal/application/ports/, internal/adapters/memory/, tests/contract/

## Dependências
T011, T012

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`65063d5` (RED), `8fc4760` (GREEN) — adapter em memória e cópias defensivas verificados.

> Aceite parcial do Chief: Unit of Work, operação de atualização no repositório e suíte tests/contract **não** foram entregues; levados para a **T023** (P003).
