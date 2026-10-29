---
id: T062
phase: P007
title: README final, rastreabilidade e roteiro de apresentação
status: completed
owner: agy-doc
contract_id: C-20261022-003
depends_on: [T060, T061]
review_required: true
security_review_required: false
---

# T062 — README final, rastreabilidade e roteiro de apresentação

## Objetivo
README com como rodar e testar; tabela requisito → teste no Go; roteiro.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] Rastreabilidade dos 12 requisitos para os testes novos
- [x] Execução limpa a partir de um clone

## Componentes afetados
sistemabancariorefatorado/README.md, docs/

## Dependências
T060, T061

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
PR #6 mergeado em main (cff678b) em 2026-10-23: README final + docs/ copiado (ADR-014), sincronizado após o PR #7.
