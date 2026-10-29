---
id: T023
phase: P003
title: Completar T014 — persistir alterações, Unit of Work e suíte de contrato
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: []
review_required: true
security_review_required: false
---

# T023 — Completar T014 (executar ANTES da T020)

## Objetivo
Na P002 os casos de uso alteram entidades por ponteiro sem persistir; com SQLite isso perde dados.
Corrigir o desenho das portas antes do adapter SQLite.

## Escopo
- Adicionar às portas a operação de atualização (ex.: `Atualizar(*Entidade) error`) e fazer `Ativar`, `Desativar` e `Transferir` chamarem-na.
- Porta `UnitOfWork` (ex.: `Executar(func(repos) error) error`) usada pela transferência; implementação em memória.
- Repositório em memória deve guardar **cópias** (alterar a entidade buscada sem `Atualizar` não pode mudar o estado guardado).
- Suíte de contrato em `backend/tests/contract/` parametrizada pelo adapter, rodando contra `memory` (na T020 também contra `sqlite`).

## Não-objetivos
Adapter SQLite (T020).

## Critérios de aceite
- [ ] Teste RED: alterar entidade buscada sem `Atualizar` não altera o repositório.
- [ ] Transferência via UnitOfWork; falha não altera nenhum saldo.
- [ ] `tests/contract` com unicidade de id, listagem como cópia, atualizar, remover, buscar inexistente.
- [ ] Sugestões A1/A2 do review P002 tratadas se couberem aqui.

## Componentes afetados
backend/internal/application/**, backend/internal/adapters/memory/**, backend/tests/contract/

## Dependências
nenhuma (primeira tarefa da P003)

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`. TDD com commits RED/GREEN/REFACTOR.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #2 mergeado em main (f9cddb1) em 2026-10-22; reviews P003-PR2-rodada1/2 + verificação final do Chief (fc6f74b).
