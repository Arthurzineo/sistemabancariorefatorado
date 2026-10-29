---
status: enabled
project_root: .
graph_path: graphify-out/graph.json
graphify_cli: graphify
mcp_executable: graphify-mcp
mcp_mode: not-configured
mcp_startup: not-configured
last_build: 2026-10-22T21:13:50-03:00
last_update: 2026-10-23T22:28:34-03:00
last_verified: 2026-10-22
---

# GRAPHIFY — sistemabancarioporIA

## Propósito
Grafo de conhecimento derivado (código, docs, artefatos `.orca`) compartilhado por todos os agentes deste projeto. **Não** é fonte de verdade: em conflito, o repositório vence.

## Localização do grafo
`graphify-out/graph.json` (um grafo para este projeto; nunca um por agente; nunca construir a partir de `../`).

## Status verificado (2026-10-23)
- `graphify` 0.9.94 (PyPI `graphifyy[mcp,pdf]`): instalado em venv `~/.local/share/graphify-venv`, link em `~/.local/bin/graphify`.
- `graphify-mcp`: instalado, link em `~/.local/bin/graphify-mcp` (stdio ou HTTP).
- Skill de agente: `~/.claude/skills/graphify/` (comando `/graphify`), registrada em `~/.claude/CLAUDE.md`.
- Grafo: **construído** em `graphify-out/graph.json` (1348 nós em 2026-10-23), atualizado com `graphify update .` ao fim de cada fase.
- Raiz do grafo: esta pasta (`sistemabancarioporIA/`), incluindo `sistemabancariorefatorado/`. Nunca construir a partir de `../`.

## Build
Build completo: no Claude Code, a partir desta raiz, `/graphify .`.
Reextração só de código (sem LLM): `graphify update .`.

## Update / Query
```bash
graphify update .
graphify query "Quais são os componentes centrais e como se conectam?"
```

## MCP por agente
Não configurado ainda (o grafo não existe). Para stdio: `graphify-mcp <caminho-absoluto>/graphify-out/graph.json`.
Se o cliente for `global-single-graph`, verificar que aponta para ESTE projeto antes de consultar.

## Política de indexação
- Indexar: código, `docs/`, `.orca/PROJECT.md`, `SUMMARY.md`, `LESSONS_LEARNED.md`, `PHASE.md`, tarefas.
- Diários: indexar enquanto não gerarem ruído; política de exclusão decidida pelo Chief.
- Excluir: segredos, artefatos de build, dependências vendorizadas.

## Troubleshooting
1. Abrir novo terminal (PATH) → `command -v graphify graphify-mcp`.
2. Verificar `graphify-out/graph.json`.
3. Verificar binding MCP do cliente → reconectar → query de teste.
4. Grafo desatualizado → `graphify update .`.
