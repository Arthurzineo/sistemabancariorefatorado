---
id: T061
phase: P007
title: Revisão de segurança (entrada, containers, dependências)
status: completed
owner: agy
contract_id: C-20261022-002
depends_on: [T052]
review_required: false
security_review_required: false
---

# T061 — Revisão de segurança (entrada, containers, dependências)

## Objetivo
Usar secure-software-engineering e dependency-supply-chain.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] Relatório com severidades

## Componentes afetados
sistemabancariorefatorado/

## Dependências
T052

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
Relatório detalhado com classificação de severidades (Crítica, Alta, Média, Baixa) emitido em `.orca/phases/007-qualidade-entrega/reviews/T061-security.md`.
