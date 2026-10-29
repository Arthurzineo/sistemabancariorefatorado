---
id: T003
phase: P001
title: Definir papéis de Claude, Codex e Agy
status: completed
owner: claude
contract_id: null
depends_on: [T002]
review_required: false
security_review_required: false
---

# T003 — Definir papéis de Claude, Codex e Agy

## Objetivo
Registrar a função de cada agente, conforme explicação do usuário, e atribuir donos às tarefas.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] Papéis registrados em .orca/roles/ e PROJECT.md
- [x] owner preenchido nas tarefas das fases P002+

## Componentes afetados
.orca/roles/*.md, tarefas

## Dependências
T002

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
Definido pelo usuário em 2026-10-22: claude = chief; codex = worker (programador); agy = tester-reviewer; agy-doc = documentarian + summarizer. Registrado em .orca/roles/README.md; contratos C-20261022-001/002/003.
