# Roteiro do Chief — monitor a cada 10 min

Objetivo: levar o projeto até o fim da P007 **sem pedir nada ao usuário**. Cada execução do loop segue estes passos.

Constantes:
- Raiz ORCA: `/home/arthur/Documents/ORCA/sistemabancarioporIA`
- Repo: `sistemabancariorefatorado/` (github.com/Arthurzineo/sistemabancariorefatorado)
- Run: `run_632b4c0e3c2c`
- Handles: codex `term_8e99231c-88d8-40f3-925b-f99dcc10d1a3`, agy `term_7ce7c723-ace9-426d-850c-09cfc3c9f712`,
  agy-doc `term_f5f3e60d-8c17-4235-945a-23592d8afea2` (se ficarem obsoletos: `orca terminal list --json`, pelo agentIdentity e título).

## 1. Caixa de entrada
`orca orchestration check --json` → processe todas as mensagens → `--ack <deliveryId>`.
- `ORCA/DONE P00N` do codex → passo 3.
- `question`/`escalation` → decida (docs/decisoes.md, requisitos) e responda pelo terminal do agente; registre ADR se for decisão nova.
- `ORCA/STATUS phase-review` do agy-doc → resolva as inconsistências apontadas (ou repasse ao codex) e libere a próxima fase.

## 2. Saúde dos agentes (detecção de travamento)
Para cada handle: `orca terminal show` + `orca terminal read --limit 40`.
Travado = algum destes:
- prompt de aprovação/pergunta local esperando resposta (ex.: "Allow?", "y/n", "Do you want", menu de permissão) → responda pelo terminal de acordo com o contrato (permitir comandos dentro do escopo; negar fora dele);
- erro do agente (rate limit, crash, "terminal exited", sessão deslogada);
- ocioso (`tui-idle`) com trabalho pendente segundo EXEC.md/caixa, e sem mensagem nova há > 20 min;
- a mesma tela em 2 checagens seguidas com um spinner "Working" há > 30 min sem novos commits (`git log origin/<branch>`).
Ação: `orca terminal wait --for tui-idle` curto e depois `terminal send` de um `ORCA/STATUS-REQUEST` em uma linha que lembre a tarefa atual e o próximo passo. Se o processo saiu, reinicie o agente com `orca agent launch` no mesmo diretório e reenvie o contrato + estado (registre no diário do Chief).
Canal: se `orchestration send` ou `terminal send` falhar, registre o erro exato no diário e tente de novo no próximo ciclo; após 2 falhas, recrie o Run (`run-create`) e avise os agentes pelo terminal.

## 3. Fechamento de fase (após ORCA/DONE)
1. Confira o PR: `gh pr view <n> --json state,mergeable,commits`; leia os reviews em `.orca/phases/<fase>/reviews/`.
2. Verifique localmente no branch: `go vet ./... && go test ./...` (backend) / `npm ci && npm test && npm run build` (frontend).
3. OK → `gh pr merge <n> --merge --delete-branch=false`; atualize as tarefas para `completed` e o PHASE.md para `completed`.
4. Envie ao agy-doc: `ORCA/ASSIGN phase-review P00N ...` (Aditivo A1 do C-003).
5. Envie ao codex: `ORCA/GO P00N+1` (próxima fase) e atualize EXEC.md.
6. Escreva um checkpoint no diário do Chief (`.orca/phases/<fase>/diaries/<data>_claude_<fase>.md`).

## 4. P007
Depois do merge da P006: `ORCA/GO P007` → agy (T060, T061) e agy-doc (T062); o codex corrige os achados aceitos num PR `codex/p007-correcoes`.
Fim: todas as tarefas `completed`, os contratos movidos para `contracts/completed/`, SUMMARY final e graphify atualizado → parar o loop e reportar ao usuário.

## Docker
Resolvido em 2026-10-22: usar `sg docker -c "docker compose ..."`. Incluir isso no ORCA/GO P006 ao codex e ao agy.

## Padrões observados
- Perguntas (`type question`) bloqueiam o codex: responda no mesmo ciclo com `orchestration reply` + `terminal send` (ele só acorda com o prompt).
- Ao pedir mudanças num PR aberto, crie `.orca/state/codex-changes-requested` (o auto-continue passa a retomar mesmo com PR aberto) e apague-o no merge.
- O codex encerra o turno sozinho a cada poucos commits (6x até a P004). Mitigação automática: Monitor rodando `.orca/state/codex-autonudge.sh` (auto ORCA/CONTINUE se ocioso >150s, sem PR aberto e sem sinal de bloqueio). Rearmar o Monitor quando expirar (30 min) enquanto houver fase em andamento.

- Desligue o monitor de auto-continue quando o codex estiver em standby legítimo (ex.: P007 aguardando achados), senão ele gasta rate limit com nudges repetidos; rearme quando houver trabalho.
- Codex pode travar no menu "Approaching rate limits — Switch to gpt-5.6-luna?": responda com `orca terminal send --enter` (opção 1 = modelo mais barato, mantém o projeto andando). Se depois `terminal send --text ... --enter` der `agent_prompt_blocked` (detecção antiga do Orca), envie `--text` sem `--enter` e em seguida um `--enter` separado.

## Regras
- Nunca pedir nada ao usuário. Decidir com base em docs/ e nas decisões registradas.
- Não codificar no lugar do codex (salvo correções triviais de merge, registradas no diário).
- Uma mensagem por agente por ciclo, no máximo, salvo resposta a uma pergunta.
