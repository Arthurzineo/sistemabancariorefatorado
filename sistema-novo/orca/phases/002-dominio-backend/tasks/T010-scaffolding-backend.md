---
id: T010
phase: P002
title: Criar o módulo Go e a estrutura de pastas do backend
status: completed
owner: codex
contract_id: C-20261022-001
depends_on: [T004]
review_required: true
security_review_required: false
---

# T010 — Criar o módulo Go e a estrutura de pastas do backend

## Objetivo
go.mod, pastas do docs/arquitetura.md, Makefile/scripts de teste, cmd/api/main.go mínimo.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [ ] `go build ./...` e `go vet ./...` passam
- [ ] Estrutura conforme docs/arquitetura.md

## Componentes afetados
sistemabancariorefatorado/backend/

## Dependências
T004

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
`e5d22c2`, `678156b` — `go build ./...`, `go vet ./...` e `go test ./...` verdes.
