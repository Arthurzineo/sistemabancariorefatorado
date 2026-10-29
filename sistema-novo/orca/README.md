# orca/ — registro da equipe de agentes

Esta pasta é uma cópia da pasta `.orca/` usada durante o desenvolvimento, no estado em que o projeto
terminou (fases P001 a P008 concluídas). Ela mostra **como** a migração foi feita: quem fez o quê,
com qual autorização e o que deu errado no caminho.

| Pasta / arquivo | Conteúdo |
|---|---|
| `PROJECT.md` | Objetivo, escopo, arquitetura e regras do projeto |
| `roles/` | Os papéis: chief, worker, tester-reviewer, documentarian, summarizer etc. |
| `contracts/completed/` | Os contratos de trabalho de cada agente (Codex, Agy e agy-doc) |
| `phases/NNN-*/` | Cada fase com `PHASE.md`, `tasks/` (tarefas e critérios de aceite), `diaries/` (diário de cada agente) e `reviews/` (pareceres de revisão) |
| `state/chief-loop.md` | O roteiro que o Chief seguia a cada 10 minutos para monitorar os agentes |
| `state/codex-autonudge.sh` | O script que retomava o programador quando ele parava sem motivo |
| `SUMMARY.md` | Resumo consolidado do projeto, mantido pelo agy-doc |
| `LESSONS_LEARNED.md` | As 14 lições aprendidas |
| `EXEC.md` | Quem estava ativo em cada momento (no fim, ninguém) |
| `GRAPHIFY.md` | Configuração do grafo de conhecimento compartilhado pelos agentes |
| `templates/` | Modelos de tarefa, contrato e diário |

Os arquivos foram mantidos como estavam. Por isso citam caminhos da máquina original e a estrutura
antiga do repositório: `sistemabancariorefatorado/backend` hoje é `sistema-novo/backend`, e
`docs/` hoje é `sistema-novo/docs/`.

A explicação da metodologia está no [README da raiz](../../README.md).
