---
id: T043
phase: P005
title: Layout simples, responsivo e acessível
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T041, T042]
review_required: true
security_review_required: false
---

# T043 — Layout simples, responsivo e acessível

## Objetivo
CSS simples; labels nos campos; foco e mensagens com role=alert/status.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Testes RTL usando getByRole/getByLabelText

## Componentes afetados
sistemabancariorefatorado/frontend/src/styles/, components/

## Dependências
T041, T042

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #4 mergeado em main em 2026-10-23 (26 testes Vitest/MSW, build ok); reviews P005-PR4-rodada1/2 + 3 pedidos de mudança do Chief.
