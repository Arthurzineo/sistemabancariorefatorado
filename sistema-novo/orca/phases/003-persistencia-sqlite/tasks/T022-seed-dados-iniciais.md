---
id: T022
phase: P003
title: Seed dos dados iniciais (Maria, Felipe, contas 1 e 2)
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T020]
review_required: false
security_review_required: false
---

# T022 — Seed dos dados iniciais (Maria, Felipe, contas 1 e 2)

## Objetivo
Equivalente à CargaInicialFactory; idempotente; controlado por SEED=true.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] Seed não duplica ao reiniciar

## Componentes afetados
sistemabancariorefatorado/backend/internal/seed/

## Dependências
T020

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #2 mergeado em main (f9cddb1) em 2026-10-22; reviews P003-PR2-rodada1/2 + verificação final do Chief (fc6f74b).
