---
id: T030
phase: P004
title: Handlers REST, DTOs e mapeamento de erros
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T015]
review_required: true
security_review_required: true
---

# T030 — Handlers REST, DTOs e mapeamento de erros

## Objetivo
net/http (ADR-009); validação de entrada; formato de erro de docs/api.md; decidir Q02 e Q03.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Testes httptest para todas as rotas
- [ ] Todos os erros de domínio mapeados

## Componentes afetados
sistemabancariorefatorado/backend/internal/adapters/http/

## Dependências
T015

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #3 mergeado em main em 2026-10-23; review P004-PR3-rodada1 approved; verificação do Chief (curl + restart).
