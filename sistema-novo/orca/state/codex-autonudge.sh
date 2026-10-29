#!/usr/bin/env bash
# Retoma o codex automaticamente quando ele encerra o turno com trabalho pendente.
# Regras: ocioso > IDLE s, sem PR aberto no branch atual e sem sinal de bloqueio/pergunta na tela.
H=term_8e99231c-88d8-40f3-925b-f99dcc10d1a3
REPO=/home/arthur/Documents/ORCA/sistemabancarioporIA/sistemabancariorefatorado
IDLE=150; nudged=0; noeffect=0
# Se este arquivo existir, o codex tem correções pedidas: retomar mesmo com PR aberto.
FLAG=/home/arthur/Documents/ORCA/sistemabancarioporIA/.orca/state/codex-changes-requested
MSG="ORCA/CONTINUE | from: claude (chief, automático) | to: codex | Você encerrou o turno com a fase em andamento. Continue exatamente do ponto onde parou, seguindo seu plano de passos, até abrir o PR da fase e mandar o REVIEW_REQUEST ao agy (ou até receber REVIEW_RESULT e precisar responder). Se estiver bloqueado, mande type question ao run:run_632b4c0e3c2c."
while true; do
  age=$(orca terminal show --terminal $H --json 2>/dev/null | python3 -c "import json,sys,time;t=json.load(sys.stdin)['result']['terminal'];print(int(time.time()-t['lastOutputAt']/1000))" 2>/dev/null || echo ERR)
  if [ "$age" = "ERR" ]; then echo "ERRO ao ler terminal do codex (handle obsoleto?)"; sleep 60; continue; fi
  if [ "$age" -lt 60 ]; then [ $nudged -eq 1 ] && noeffect=0; nudged=0; fi
  if [ "$age" -gt $IDLE ] && [ $nudged -eq 0 ]; then
    br=$(git -C $REPO rev-parse --abbrev-ref HEAD 2>/dev/null)
    pr=$(gh pr list -R Arthurzineo/sistemabancariorefatorado --head "$br" --state open --json number --jq 'length' 2>/dev/null || echo 0)
    tail=$(orca terminal read --terminal $H --limit 15 --json 2>/dev/null | python3 -c "import json,sys;print(' '.join(json.load(sys.stdin)['result']['terminal']['tail']).lower())" 2>/dev/null)
    if [ "$pr" != "0" ] && [ ! -f "$FLAG" ]; then echo "codex ocioso ${age}s com PR aberto em $br (aguardando revisão — ok)"; nudged=1
    elif echo "$tail" | grep -q -E "bloquead|aguardando decis|question|allow|approve|y/n|press enter to confirm|rate limit"; then echo "codex ocioso ${age}s e parece bloqueado/perguntando — Chief deve verificar"; nudged=1
    else
      orca terminal send --terminal $H --text "$MSG" --enter --json >/dev/null 2>&1 && echo "auto-continue enviado ao codex (ocioso ${age}s, branch $br, sem PR)"
      nudged=1; noeffect=$((noeffect+1))
      [ $noeffect -ge 2 ] && echo "ALERTA: 2 auto-continues seguidos sem efeito — Chief deve inspecionar o codex"
    fi
  fi
  sleep 30
done
