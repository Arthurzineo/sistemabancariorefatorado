---
id: T041
phase: P005
title: Telas de clientes (R01–R07)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T040, T030]
review_required: true
security_review_required: false
---

# T041 — Telas de clientes (R01–R07)

## Objetivo
Consultar, cadastrar, validar idade, ativar/desativar, situação, remover.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Testes de componente e integração para cada operação
- [ ] Mensagens de erro da API exibidas

## Componentes afetados
sistemabancariorefatorado/frontend/src/features/clientes/

## Dependências
T040, T030

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #4 mergeado em main em 2026-10-23 (26 testes Vitest/MSW, build ok); reviews P005-PR4-rodada1/2 + 3 pedidos de mudança do Chief.
