---
id: T012
phase: P002
title: Entidade ContaCorrente: saldo finito e situação (R09, R10)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T010]
review_required: true
security_review_required: false
---

# T012 — Entidade ContaCorrente: saldo finito e situação (R09, R10)

## Objetivo
TDD da Conta: fábrica com saldo finito, definir saldo, ativar/desativar, Situacao.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] SaldoFinitoTest e SituacaoContaCorrenteTest portados
- [ ] Commits RED/GREEN/REFACTOR

## Componentes afetados
sistemabancariorefatorado/backend/internal/domain/conta/

## Dependências
T010

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`2ec1265` (RED), `c1f87b4` (GREEN), `88e118a` (situação) — testes verdes.
