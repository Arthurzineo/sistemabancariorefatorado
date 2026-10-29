---
id: T011
phase: P002
title: Entidade Cliente: idade 18..65 e situação (R03, R06)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T010]
review_required: true
security_review_required: false
---

# T011 — Entidade Cliente: idade 18..65 e situação (R03, R06)

## Objetivo
TDD do Cliente: fábrica com validação de idade, alteração de idade, ativar/desativar, Situacao.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] ValidacaoIdadeClienteTest e SituacaoClienteTest portados
- [ ] Commits RED/GREEN/REFACTOR

## Componentes afetados
sistemabancariorefatorado/backend/internal/domain/cliente/

## Dependências
T010

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`6185b8d` (RED), `ac7c358` (GREEN), `1d251b8` (situação) — testes verdes.
