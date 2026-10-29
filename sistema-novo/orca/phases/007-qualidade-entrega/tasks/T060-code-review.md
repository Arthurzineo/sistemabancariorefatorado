---
id: T060
phase: P007
title: Revisão de código e arquitetura (dependências apontando para dentro)
status: completed
owner: agy
contract_id: C-20261022-002
depends_on: [T052]
review_required: false
security_review_required: false
---

# T060 — Revisão de código e arquitetura (dependências apontando para dentro)

## Objetivo
Usar code-review-expert e architecture-audit.

## Escopo
Somente o descrito no objetivo e nos componentes afetados.

## Não-objetivos
Qualquer coisa de outras tarefas; mudanças de arquitetura sem aprovação do Chief.

## Critérios de aceite
- [x] Nenhum import de adapter dentro de domain/application
- [x] Achados resolvidos ou registrados

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
Relatório detalhado emitido em `.orca/phases/007-qualidade-entrega/reviews/T060-review.md` confirmando zero imports de adapters em domain/application e registrando os achados arquiteturais para correção.
