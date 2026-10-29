---
id: P008
title: Redesign do frontend (moderno e bonito)
status: completed
owner: claude
depends_on: [P007]
---

# Fase P008 — Redesign do frontend

## Propósito
Pedido do usuário (2026-10-23): deixar o frontend mais bonito e moderno, com base em pesquisa de UI financeira.

## Resultado esperado
Frontend conforme `docs/design-frontend.md` e ADR-020, com todas as operações preservadas.

## Critérios de entrada
P007 concluída (main em cff678b).

## Critérios de saída
- Todas as telas do design implementadas; tema claro/escuro.
- `npm ci && npm test && npm run build` verdes; E2E verde com capturas de tela.
- Revisão do agy aprovada (incluindo revisão visual das capturas) e verificação do Chief.

## Tarefas
| ID | Título | Status | Owner |
|---|---|---|---|
| T080 | Tokens, tema claro/escuro, app shell e componentes base | completed | codex |
| T081 | Visão geral (saldo total e resumos) | completed | codex |
| T082 | Contas em cartões + transferência em 3 passos | completed | codex |
| T083 | Clientes em tabela, dialogs e confirmação de remoção | completed | codex |
| T084 | Acessibilidade/responsividade, E2E com capturas | completed | codex |

## Dependências
P007.

## Riscos
- Quebrar testes existentes ao mudar a estrutura → manter labels/roles e ajustar seletores sem remover casos.
- Excesso de efeito visual → seguir os princípios do §1 do design.

## Decisões da fase
ADR-020.
