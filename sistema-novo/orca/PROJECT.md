---
project_id: sistemabancarioporIA
status: completed (P001–P008 concluídas em 2026-10-23)
graphify: enabled (grafo em graphify-out/graph.json)
chief: claude
created: 2026-10-22
---

# PROJECT — sistemabancarioporIA

> Contexto estável do projeto. Não usar como feed de atividade (isso é o `EXEC.md`).

## Objetivo
Atividade de aula: refatorar o Sistema Bancário de console (Java) para uma aplicação
**cliente-servidor** com backend em **Go** (hexagonal + MVC, design patterns), frontend **React (Vite)**,
persistência **SQLite** atrás de um adapter DAO, desenvolvida com **TDD, BDD e DDD**, com testes
de frontend, e empacotada em **2 containers Docker** ligados por uma rede.

## Escopo
- Paridade com as 12 operações e regras do original (`docs/requisitos.md`).
- API REST (`docs/api.md`).
- Frontend que permita usar as 12 operações.
- Adapters SQLite e em memória para os repositórios.
- Testes: unidade, casos de uso, contrato de repositório, HTTP, BDD (godog) e frontend (Vitest/RTL/MSW).
- `docker compose` com `frontend` (nginx) + `backend` (Go) na rede `banco-net`.

## Fora de escopo
- Autenticação/usuários (o original não tem).
- Alterar dados cadastrais do cliente além do que o domínio já cobre (ver Q04).
- Deploy em nuvem / VMs reais.
- `BigDecimal`/decimal exato (ADR-003 mantém `float64`).

## Projeto de origem (somente leitura)
`../SistemaBancario_entrega/SistemaBancario/` — Java 8, Maven, JUnit 4, Cucumber 7.
55 testes JUnit + 15 cenários BDD. **Não modificar**; serve de especificação.

## Arquitetura do repositório
```text
sistemabancarioporIA/            # raiz do projeto ORCA (planejamento + estado)
├── .orca/                       # estado ORCA autoritativo
├── docs/                        # documentação do projeto
├── GRAPHIFY.md / graphify-out/
└── sistemabancariorefatorado/   # código novo (repositório git próprio)
    ├── backend/                 # Go
    ├── frontend/                # React + Vite
    └── docker-compose.yml
```
Detalhes em `docs/arquitetura.md`.

## Tecnologias
Go 1.25 · net/http · modernc.org/sqlite · godog · React + Vite (JavaScript) · Vitest · React Testing Library · MSW · Playwright (opcional) · nginx · Docker 29 + compose.

## Ambientes
- Local: Linux (Pop!_OS), Go 1.25.0, Node 22.23.4, Docker 29.1.3 (**sem** o plugin compose em 2026-10-22).
- Execução final: `docker compose up --build` → http://localhost:3000.

## Restrições de segurança
- Nunca versionar segredos.
- Containers sem root; só o frontend publica porta no host.
- Validar toda entrada na borda (HTTP) e as regras no domínio.

## Requisitos de qualidade
- Clean code / clean architecture; arquivos pequenos, um conceito por arquivo.
- Domínio sem dependências externas.
- TDD com commits RED/GREEN/REFACTOR (ADR-008).
- `go vet` e `go test ./...` verdes; `npm test` verde.

## Documentação autoritativa
| Arquivo | Conteúdo |
|---|---|
| `docs/requisitos.md` | Requisitos, regras de domínio, pontos em aberto, rastreabilidade |
| `docs/arquitetura.md` | Hexagonal/MVC, pastas, patterns, fluxo |
| `docs/estrategia-testes.md` | TDD/BDD/DDD, ferramentas, porte dos testes |
| `docs/api.md` | Contrato REST e mapeamento de erros |
| `docs/infra-docker.md` | Containers, rede, volume |
| `docs/decisoes.md` | ADRs |

## Convenções
- Fases: `.orca/phases/NNN-nome/` com `PHASE.md`, `tasks/`, `diaries/`.
- Tarefas: `TNNN-nome.md` dentro da fase.
- Diários: `YYYY-MM-DDTHHMM_<agent-id>_<task-id>.md`, um por agente.
- Contratos: `C-YYYYMMDD-NNN.md` em `contracts/active/` → `contracts/completed/`.
- Commits: `test(Rxx): RED - ...`, `feat(Rxx): GREEN - ...`, `refactor(Rxx): ...`, `chore:`, `docs:`.
- Templates em `.orca/templates/`.

## Graphify
Status: **enabled**, grafo pendente até haver código (Graphify 0.9.94 instalado em 2026-10-22). Ver `GRAPHIFY.md`.

## Chief atual
`claude` (Claude Code). Equipe: codex = programador, agy = revisor/testador, agy-doc = documentarista + Summarizer (ver .orca/roles/README.md).

## Canal de comunicação ORCA (verificado em 2026-10-22)
- Run do Orca: `run_632b4c0e3c2c` (caixa de entrada do Chief, coordenador `term_852748c8-…`).
- **Chief → agente:** `orca terminal send --terminal <handle> --text "<mensagem ORCA>" --enter` (o agente processa o prompt)
  e/ou `orca orchestration send --to <handle> --type status|question --subject ... --body ...` (fica na caixa do agente).
- **Agente → Chief:** `orca orchestration send --to run:run_632b4c0e3c2c --type <status|question|escalation> --subject "<ORCA/TIPO> <tarefa>" --body "<mensagem>" --json`.
- **Agente lê a própria caixa:** `orca orchestration check --terminal <seu handle> --json`.
- Handles atuais: codex `term_8e99231c-88d8-40f3-925b-f99dcc10d1a3`, agy `term_7ce7c723-ace9-426d-850c-09cfc3c9f712`,
  agy-doc `term_f5f3e60d-8c17-4235-945a-23592d8afea2`. Handles mudam se o Orca reiniciar: confira com `orca terminal list --json`.
- Git: `sistemabancariorefatorado/` é o checkout do codex; agy usa `/home/arthur/Documents/ORCA/.worktrees-sbia/agy-review`, agy-doc usa `.../.worktrees-sbia/agy-doc` (worktrees).
- Agente ↔ agente (ex.: REVIEW_REQUEST do codex para o agy): `orca orchestration send --to <handle do destino>` **com cópia** para `run:run_632b4c0e3c2c`.
