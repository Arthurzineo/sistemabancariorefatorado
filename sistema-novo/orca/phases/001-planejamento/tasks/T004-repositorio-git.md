---
id: T004
phase: P001
title: Criar a pasta do código e o repositório git privado
status: completed
owner: claude
contract_id: null
depends_on: [T002]
review_required: false
security_review_required: false
---

# T004 — Criar a pasta do código e o repositório git privado

## Objetivo
Criar sistemabancariorefatorado/, git init, primeiro commit e repositório privado no GitHub sincronizado.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] sistemabancariorefatorado/ com README e .gitignore
- [x] Repositório privado criado e com push do commit inicial

## Componentes afetados
sistemabancariorefatorado/

## Dependências
T002

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
Repositório privado https://github.com/Arthurzineo/sistemabancariorefatorado (branch main, commit 3105672 "chore: estrutura inicial do repositório"), criado em 2026-10-22. Git local configurado só no repositório: user.name=Arthurzineo.
