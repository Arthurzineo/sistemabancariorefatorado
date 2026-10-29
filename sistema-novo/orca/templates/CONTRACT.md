---
contract_id: C-YYYYMMDD-NNN
project_id: sistemabancarioporIA
phase_id: P00N
task_id: T00N
chief: <chief-agent-id>
agent: <agent-id>
role: <role-id>
parent_contract: null
status: proposed   # proposed | accepted | active | blocked | cancelled | delivered | accepted_by_chief | completed
delegation_allowed: false
required_skills:
  - orca-protocol
  - graphify-project-knowledge
required_context:
  - .orca/PROJECT.md
  - .orca/EXEC.md
  - .orca/roles/<role>.md
  - .orca/phases/<fase>/PHASE.md
  - .orca/phases/<fase>/tasks/<task>.md
  - GRAPHIFY.md
graphify:
  enabled: false
  config: GRAPHIFY.md
  graph: graphify-out/graph.json
---

# Contrato C-YYYYMMDD-NNN

## Objetivo
## Escopo
## Não-objetivos
## Autoridade concedida
- may_modify:
- may_decide:
- must_escalate:
## Ações proibidas
## Entregáveis
## Critérios de aceite
## Testes/revisões exigidos
## Reporte
- chief:
- diary_required: true
- status_on: blocker, scope conflict, review readiness, completion
## Delegação
## Condições de escalonamento
