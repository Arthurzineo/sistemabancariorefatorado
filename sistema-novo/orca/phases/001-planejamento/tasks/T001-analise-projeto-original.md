---
id: T001
phase: P001
title: Analisar o projeto original e extrair requisitos
status: completed
owner: claude
contract_id: null
depends_on: []
review_required: false
security_review_required: false
---

# T001 — Analisar o projeto original e extrair requisitos

## Objetivo
Ler código de domínio, testes JUnit e .feature do original e registrar as regras.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] 12 requisitos e regras de domínio em docs/requisitos.md
- [x] Rastreabilidade com os 55 testes + 15 cenários

## Componentes afetados
docs/requisitos.md

## Dependências
nenhuma

## Restrições
- Seguir `docs/arquitetura.md` e `docs/decisoes.md`.
- Clean code: arquivos pequenos, um conceito por arquivo.

## Testes
Conforme `docs/estrategia-testes.md`.

## Evidência de conclusão
Leitura de src/negocio/*.java, test/java/**, test/resources/features/*.feature (2026-10-22).
