---
id: T015
phase: P002
title: Casos de uso das 12 operações
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T013, T014]
review_required: true
security_review_required: false
---

# T015 — Casos de uso das 12 operações

## Objetivo
Um arquivo por caso de uso em application/cliente e application/conta.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] CadastroClienteTest, CadastroContaCorrenteTest e RemocaoTest portados
- [ ] Inexistente ≠ inativo; remover cliente não remove a conta

## Componentes afetados
sistemabancariorefatorado/backend/internal/application/

## Dependências
T013, T014

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`a5aa94b`/`7901f24`, `d25d759`/`e92be06`, `8c915a6`/`1d251b8`, `f5f114f`/`88e118a` — casos de uso P002 e testes verdes.
