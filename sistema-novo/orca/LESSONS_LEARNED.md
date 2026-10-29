# LESSONS LEARNED — sistemabancarioporIA

> Mantido exclusivamente pelo Summarizer designado (`agy-doc`).
> Registra lições aprendidas promovidas a partir de evidências nos diários e na execução do projeto.

---

## L-001 — Projeto original mantido como especificação somente leitura

- **Categoria:** process
- **Escopo:** project
- **Confiança:** high
- **Contexto:** O projeto legado em Java (`../SistemaBancario_entrega/SistemaBancario`) contém 55 testes unitários JUnit e 15 cenários BDD consolidados que definem o comportamento esperado do sistema bancário.
- **Observação:** Manter o repositório legado intacto e acessível apenas como referência de especificação evita desvios não intencionais de regras de negócio durante a refatoração para Go e garante fidelidade de domínio.
- **Consequência:** As 12 operações e suas regras de borda (idade 18–65 inclusiva, saldo finito, regras de transferência atômica com motivos explícitos) puderam ser mapeadas com rastreabilidade formal na documentação antes do início da implementação.
- **Recomendação:** Preservar a pasta do projeto legado em modo estritamente somente leitura durante todas as fases do projeto ORCA e usar seus casos de teste como baseline direta para a suíte de testes em Go.
- **Evidência:**
  - `.orca/phases/001-planejamento/diaries/2026-10-22T2100_claude_P001.md`
  - `docs/requisitos.md §6`

---

## L-002 — Repositórios em memória devem usar cópias defensivas para emular persistência real

- **Categoria:** architecture / testing
- **Escopo:** component
- **Confiança:** high
- **Contexto:** Em testes com repositórios em memória, entidades em Go são comumente manipuladas através de ponteiros (`*Entidade`).
- **Observação:** Se o repositório em memória retém diretamente a referência do ponteiro, alterações de estado realizadas na camada de aplicação passam a refletir no "armazenamento" mesmo sem a invocação de `Atualizar(...)`. Contudo, ao plugar um banco real (como SQLite), essa ausência de chamada explícita de atualização acarreta perda imediata de dados.
- **Consequência:** Casos de uso podem parecer verdes em testes de unidade com memória mas quebrar ao integrar com persistência durável.
- **Recomendação:** Implementar clonagem defensiva (`Copia()`) tanto na busca/listagem quanto na persistência no repositório em memória, forçando os casos de uso a chamarem métodos explícitos de atualização e assegurando paridade com a suíte de contrato de persistência.
- **Evidência:**
  - `.orca/phases/002-dominio-backend/reviews/P002-PR1-rodada1.md`
  - `.orca/phases/003-persistencia-sqlite/tasks/T023-completar-portas-uow-contrato.md`
  - `backend/internal/adapters/memory/persistencia_test.go`

---

## L-003 — Testes de limites extremos em float64 protegem contra overflow silencioso

- **Categoria:** testing / implementation
- **Escopo:** domain
- **Confiança:** high
- **Contexto:** A decisão ADR-003 manteve `float64` para valores monetários por paridade estrita com o sistema legado Java, exigindo salvaguardas de saldo sempre finito.
- **Observação:** Créditos em saldos já elevados podem estourar a capacidade do tipo e resultar em `+Inf`, corrompendo o estado contábil.
- **Consequência:** A validação prévia de `ErrCreditoNaoFinito` comprovou-se necessária para rejeitar operações em que o saldo resultante deixaria de ser finito, preservando o saldo anterior sem débito indevido.
- **Recomendação:** Manter suítes de teste exploratório com limites extremos (`math.MaxFloat64`) em todas as operações de crédito e transferência que envolvam ponto flutuante.
- **Evidência:**
  - `.orca/phases/002-dominio-backend/reviews/P002-PR1-rodada1.md` §1.4
  - `backend/internal/domain/conta/transferencia.go`

---

## L-004 — Critérios de aceite devem ser mapeados para testes entregues no branch do PR antes da aprovação

- **Categoria:** process / testing
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Na fase P003, o revisor emitiu parecer `approved` duas vezes sem que o branch do PR (`codex/p003-persistencia-sqlite`) contivesse testes automatizados cobrindo todos os critérios de aceite: na Rodada 1, a suíte de contrato contra SQLite e a transferência via UnitOfWork foram tratadas apenas como sugestões; na Rodada 2, o revisor adicionou testes exploratórios em seu próprio worktree de revisão (`agy/review-p003`), mas o branch do PR ainda não continha testes de rollback de UnitOfWork SQLite, falha forçada no 2º Atualizar e idempotência do seed com tratamento de erro.
- **Observação:** O Chief precisou intervir duas vezes com `CHANGES_REQUESTED` para exigir que o desenvolvedor entregasse os testes formalmente no branch que seria mergeado no `main`.
- **Consequência:** Retrabalho e necessidade de múltiplas rodadas de revisão que poderiam ter sido evitadas se o revisor tivesse verificado o cumprimento estrito dos critérios de aceite contra os commits do PR.
- **Recomendação:** Estabelecer como regra mandatória de revisão que o parecer só pode ser `approved` se houver uma matriz de rastreabilidade explícita mapeando **cada critério de aceite de cada tarefa** para uma função de teste automatizada presente no branch do PR. Qualquer critério não coberto por teste entregue pelo autor do PR deve ser classificado compulsoriamente como **bloqueante** (`CHANGES_REQUESTED`).
- **Evidência:**
  - `.orca/phases/003-persistencia-sqlite/reviews/P003-PR2-rodada1.md`
  - `.orca/phases/003-persistencia-sqlite/reviews/P003-PR2-rodada2.md`
  - `.orca/phases/003-persistencia-sqlite/diaries/2026-10-22T2220_claude_P003.md`
  - Commits `e6655e6`, `fc6f74b` e `f9cddb1`

---

## L-005 — Monitor de auto-nudge previne ociosidade oculta de agentes em execução autônoma

- **Categoria:** operations / process
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Durante a fase P004, o agente programador (`codex`) encerrou interações repetidas vezes sem abrir PR, sem reportar bloqueio formal (`ORCA/BLOCKED`) e sem formular dúvidas técnicas (`ORCA/QUESTION`), paralisando o fluxo de trabalho.
- **Observação:** Esperar verificações manuais periódicas introduzia latência desnecessária no ciclo de desenvolvimento.
- **Consequência:** A criação de um script de auto-estímulo (`.orca/state/codex-autonudge.sh`) executado pelo loop de monitoramento do Chief permitiu detectar quando o agente estava ocioso sem entrega pendente e injetar prompts de continuidade de forma totalmente automatizada.
- **Recomendação:** Em projetos com múltiplos agentes autônomos, configurar scripts de monitoramento proativo (heartbeat/auto-nudge) capazes de distinguir ociosidade acidental de bloqueios reais, reativando os agentes sem intervenção humana.
- **Evidência:**
  - `.orca/phases/004-api-http-bdd/diaries/2026-10-23T0000_claude_P004.md`
  - `.orca/state/chief-loop.md`

---

## L-006 — Disciplina estrita de alternância TDD em commits de rotas e composição

- **Categoria:** process / testing
- **Escopo:** component
- **Confiança:** high
- **Contexto:** No início da fase P004, foram realizados commits de código de produção (`be26f9d`, `afe8128`, `1ef9896`, `d682c9e`) implementando rotas de consulta e composição de API antes de consolidar os testes de falha correspondentes (`test: RED`).
- **Observação:** Embora a suíte final de testes (`a6538c5`) tenha coberto 100% das rotas e dos erros com testes automatizados `httptest`, a rastreabilidade do ciclo estrito RED/GREEN no histórico git foi parcialmente quebrada nesses passos.
- **Consequência:** O Chief registrou uma ressalva formal no aceite da fase, visto que para fins de avaliação acadêmica e auditoria de processo o histórico de commits é a única evidência do fluxo TDD (ADR-008).
- **Recomendação:** Mesmo para tarefas de orquestração, wiring ou composition root, manter a disciplina atômica de criar primeiro o teste de falha (`test: RED`) e em seguida a implementação mínima (`feat: GREEN`), evitando agrupar código funcional sem o commit RED predecessor.
- **Evidência:**
  - `.orca/phases/004-api-http-bdd/diaries/2026-10-23T0000_claude_P004.md`
  - Commits `be26f9d`, `afe8128`, `1ef9896`, `d682c9e` vs `a1636c0`
  - `docs/decisoes.md#adr-008`

---

## L-007 — Revisões devem exigir testes de comportamento nominais por operação antes de aprovação

- **Categoria:** process / testing
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Na fase P005 (PR #4), o revisor aprovou a entrega na Rodada 1 com apenas 8 testes superficiais em um único arquivo, e na iteração seguinte o desenvolvedor apresentou apenas 10 testes que ainda não exercitavam as ações de cadastro, consulta, validação de idade e transferência com sucesso na interface.
- **Observação:** O Chief precisou emitir pareceres sucessivos de `CHANGES_REQUESTED` com uma lista nominal e explícita de 12 títulos de teste de comportamento (verificando payloads enviados e feedback visual) para assegurar que cada uma das operações de negócio no frontend fosse efetivamente testada com Vitest/MSW.
- **Consequência:** A suíte final saltou de 8 para 26 testes cobrindo todas as operações e motivos de erro, mas foram necessárias 3 rodadas de intervenção do Chief que poderiam ter sido evitadas se o revisor tivesse cobrado testes de comportamento nominais na primeira revisão.
- **Recomendação:** Não aprovar PRs de frontend apenas com testes de fumaça ou renderização de casca. O revisor deve exigir testes de integração/comportamento com mocks de rede (MSW) que simulem interações do usuário (digitação, clique, submissão) e verifiquem tanto o payload HTTP disparado quanto a resposta renderizada na tela para cada operação suportada.
- **Evidência:**
  - `.orca/phases/005-frontend/reviews/P005-PR4-rodada1.md`
  - `.orca/phases/005-frontend/reviews/P005-PR4-rodada2.md`
  - `.orca/phases/005-frontend/diaries/2026-10-23T0130_claude_P005.md`
  - Commits `f3a6f85`, `9422b31`, `6c257ed` e `912821f`

---

## L-008 — Bloqueio de código minificado/ilegível e imposição de padrões de legibilidade via ADR-017

- **Categoria:** architecture / process
- **Escopo:** component
- **Confiança:** high
- **Contexto:** Na entrega inicial do PR #4 da fase P005, o desenvolvedor submeteu arquivos densos e minificados (ex.: `Contas.jsx` com 3 KB comprimidos em 12 linhas) e `package.json` utilizando dependências soltas (`latest`), violando princípios de manutenibilidade e reprodutibilidade.
- **Observação:** Códigos densos dificultam a revisão por pares, auditorias de segurança e depuração, além de mascarar acoplamentos indevidos em componentes monolíticos.
- **Consequência:** O Chief emitiu `CHANGES_REQUESTED` bloqueante imediato e formalizou a decisão arquitetural ADR-017, estipulando componentização por responsabilidade (arquivos pequenos, ≲150 linhas), formatação legível (Prettier) e fixação de versões exatas (`--save-exact`) em `package.json` e `package-lock.json`.
- **Recomendação:** Definir previamente em ADR ou linter regras rígidas de formatação e limites de complexidade/tamanho de arquivo antes do início da codificação. Bloquear sumariamente qualquer código gerado de forma minificada ou compactada em submissões de PR.
- **Evidência:**
  - `docs/decisoes.md#adr-017`
  - `.orca/phases/005-frontend/diaries/2026-10-23T0130_claude_P005.md`
  - Commits `f3a6f85`, `d29e441` e `912821f`

---

## L-009 — Testes E2E contra persistência durável devem utilizar identificadores dinâmicos para assegurar idempotência

- **Categoria:** testing / process
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Na fase P006, a entrega inicial do teste E2E com Playwright (`frontend/e2e/fluxo-bancario.spec.js`) utilizou identificadores fixos (`11`) para o cadastro de conta e cliente.
- **Observação:** Na primeira execução contra o banco limpo o teste passou, mas em uma segunda execução consecutiva mantendo o volume persistente (`banco-data`) do Docker ativo, o teste falhou por timeout ao receber o erro `id_duplicado` da API REST.
- **Consequência:** A entrega foi bloqueada pelo revisor e pelo Chief (`CHANGES_REQUESTED`), exigindo refatoração para IDs dinâmicos baseados em timestamp (`Date.now()`) e comprovação de duas execuções consecutivas bem-sucedidas no mesmo volume.
- **Recomendação:** Testes ponta a ponta exercitados contra bancos reais ou ambientes de teste persistentes devem compulsoriamente gerar identificadores dinâmicos ou aleatórios válidos para evitar colisões de chave primária e falsos negativos decorrentes de dados residuais.
- **Evidência:**
  - `.orca/phases/006-docker/reviews/P006-PR5-rodada1.md` §2.5 e §3.1
  - `.orca/phases/006-docker/reviews/P006-PR5-rodada2.md` §1 e §3.3
  - Commits `b2764d7` e `8ce0f63`

---

## L-010 — Execução de containers sem privilégios de root requer ajuste explícito de caminhos de PID e caches de runtime

- **Categoria:** infrastructure / security
- **Escopo:** component
- **Confiança:** high
- **Contexto:** A especificação de segurança (RNF06 e critérios da fase P006) estipulava que ambos os containers (`backend` e `frontend`) deveriam executar estritamente sob o usuário de sistema não-root `app` (`uid=100`).
- **Observação:** Servidores padrão como Nginx em imagens Alpine tentam por padrão gravar o PID principal em `/var/run/nginx.pid` e utilizar caches em `/var/cache/nginx`, caminhos restritos ao usuário `root`.
- **Consequência:** Sem permissões adequadas, o container falha na inicialização quando executado sob `USER app`.
- **Recomendação:** Em imagens de runtime que rodem como usuário sem privilégios, ajustar explicitamente no Dockerfile a propriedade de diretórios de trabalho (`/var/cache/nginx`, `/var/run`, `/data`) via `chown -R app:app` e reconfigurar o arquivo de PID para um diretório gravável (ex.: `/tmp/nginx.pid`), garantindo compliance estrito com os princípios de menor privilégio.
- **Evidência:**
  - `frontend/Dockerfile`
  - `backend/Dockerfile`
  - `.orca/phases/006-docker/reviews/P006-PR5-rodada1.md` §2.2
  - Commit `6cfcd35`

---

## L-011 — Operações de transferência bancária devem bloquear explicitamente mesma conta de origem e destino

- **Categoria:** domain / security
- **Escopo:** domain
- **Confiança:** high
- **Contexto:** Na revisão de segurança da fase P007 (achado T061-S01), identificou-se que o código herdado da especificação Java não verificava se o identificador da conta de origem era igual ao da conta de destino na transferência.
- **Observação:** Em uma transferência onde origem e destino coincidem, a lógica debitava e creditava o mesmo saldo na mesma transação, podendo ocultar anomalias ou permitir manipulação de estado.
- **Consequência:** A regra foi formalizada na decisão ADR-018 como a 8ª condição do requisito R12 (`ErrMesmaConta` → HTTP 422 `mesma_conta`), coberta por testes no domínio, serviço, BDD e HTTP.
- **Recomendação:** Toda operação transacional entre pares de entidades deve compulsoriamente validar a não-igualdade dos identificadores de origem e destino na raiz do domínio antes de invocar a camada de persistência.
- **Evidência:**
  - `docs/decisoes.md#adr-018`
  - `backend/internal/domain/conta/transferencia.go`
  - `backend/features/transferir_valores.feature`
  - Commit `6972715` (PR #7)

---

## L-012 — Endurecimento defensivo em camadas em APIs REST e proxies reversos

- **Categoria:** security / architecture
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Durante as auditorias finais de qualidade de código (T060) e segurança (T061), foi realizada uma revisão defensiva de toda a superfície exposta da API HTTP e do proxy Nginx.
- **Observação:** Aplicações web sem autenticação requerem múltiplas barreiras de contenção para evitar negação de serviço, exaustão de conexões ou injeção de dados maliciosos.
- **Consequência:** A formalização da ADR-019 implementou em conjunto: limitação de payload via `http.MaxBytesReader` (1 MiB → 413), timeouts estritos no `http.Server` (ReadHeader 5s, Read 10s, Write 15s, Idle 60s), validação de IDs estritamente positivos (`id > 0` → 422 `id_invalido`), sanitização de campos em branco no domínio, headers de segurança no Nginx (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `server_tokens off`) e SQLite em modo Write-Ahead Logging (`WAL`).
- **Recomendação:** Endurecer proativamente a camada de transporte e roteamento mesmo em projetos simplificados, adotando limites de corpo, timeouts de socket e headers restritivos por padrão.
- **Evidência:**
  - `docs/decisoes.md#adr-019`
  - `backend/internal/adapters/http/json.go`
  - `backend/cmd/api/main.go`
  - `frontend/nginx.conf`
  - Commit `6972715` (PR #7)

---

## L-013 — Especificidade de seletores CSS pode mascarar variantes de componentes e estilos semânticos

- **Categoria:** frontend / architecture
- **Escopo:** component
- **Confiança:** high
- **Contexto:** Na fase P008 (redesign do frontend), a primeira iteração do arquivo de layout global `src/styles/app.css` continha seletores genéricos como `button:not(.icon-button)` com regras de background e borda.
- **Observação:** Devido às regras de especificidade do CSS (uma pseudo-classe `:not()` conta como classe), o seletor genérico sobrepôs classes de variante como `.button--primary` e `.button--accent` declaradas em `components.css`, fazendo com que os botões principais de ação perdessem suas cores de destaque e ficassem com aparência neutra.
- **Consequência:** Foi necessária uma rodada de correção em `app.css` e `components.css` para reordenar regras, reduzir a especificidade de seletores globais e garantir que tokens semânticos de variantes (`--accent`, `--danger`) sempre prevaleçam.
- **Recomendação:** Ao construir design systems sem bibliotecas externas, utilizar `@layer` CSS ou convenções estritas de BEM/classes utilitárias, evitando seletores de tag globais combinados com pseudo-classes `:not()` que competem com classes de variantes de componentes.
- **Evidência:**
  - `.orca/phases/008-redesign-frontend/reviews/`
  - Commits `11bb2c9`, `3a166fc` e `9b16905` (PR #8)
  - `frontend/src/styles/app.css` e `frontend/src/styles/components.css`

---

## L-014 — Revisão visual por capturas de tela E2E complementa e supera lacunas de testes de DOM automatizados

- **Categoria:** testing / process
- **Escopo:** project
- **Confiança:** high
- **Contexto:** Durante o redesign da interface (P008), todos os 33 testes automatizados com Vitest, React Testing Library e MSW passavam com 100% de sucesso desde as primeiras iterações.
- **Observação:** Apesar dos testes unitários de DOM estarem verdes, a análise das capturas de tela reais geradas pelo Playwright E2E (`frontend/e2e/screenshots/`) revelou diversos problemas visuais graves: contraste ilegível em tema escuro (texto branco sobre botão com fundo claro `#82a4ff`), botões secundários desalinhados, falta de espaçamento em telas mobile (390px) e variantes de botão desconfiguradas.
- **Consequência:** A revisão técnica baseou-se diretamente na inspeção das evidências visuais das capturas nos dois temas e resoluções, permitindo ao Chief e aos revisores detectar e exigir correções visuais que nenhuma asserção de DOM em JSDOM era capaz de capturar.
- **Recomendação:** Em tarefas de frontend e redesign, incorporar capturas de tela automatizadas em múltiplos temas e viewports no pipeline de E2E, tratando a inspeção visual das imagens como critério indispensável de aceite antes de aprovações de PR.
- **Evidência:**
  - `.orca/phases/008-redesign-frontend/reviews/`
  - `frontend/e2e/screenshots/`
  - Commits `11bb2c9`, `3a166fc` e `9b16905` (PR #8)
  - `docs/design-frontend.md`

