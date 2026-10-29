# SUMMARY — sistemabancarioporIA

> Mantido exclusivamente pelo Summarizer designado (`agy-doc`, papel `documentarian + summarizer`).
> Todas as afirmações são rastreáveis aos artefatos do repositório.

**Última atualização:** 2026-10-23T22:30:00-03:00 (Conclusão da fase P008 — Redesign do frontend)

---

## 1. Objetivo do projeto
Refatorar o Sistema Bancário de console em Java 8 para uma aplicação cliente-servidor:
- **Backend:** Go 1.25 (arquitetura hexagonal ports & adapters + MVC, design patterns), sem frameworks pesados de terceiros.
- **Frontend:** React + Vite em JavaScript moderno (HTML/CSS/JS) sem TypeScript ([ADR-004](docs/decisoes.md#adr-004)), componentização estrita por responsabilidade ([ADR-017](docs/decisoes.md#adr-017)), design system moderno e acessível com tema claro/escuro nativo via `light-dark()`, fluxo guiado de transferência em 3 passos e WCAG 2.2 AA ([ADR-020](docs/decisoes.md#adr-020)).
- **Persistência:** SQLite em modo Write-Ahead Logging (WAL) via adapter DAO (`modernc.org/sqlite v1.58.0`, sem CGO) e adapter em memória com cópias defensivas.
- **Metodologia:** Desenvolvimento guiado por TDD, BDD (godog, Gherkin em português) e DDD.
- **Containers:** 2 containers Docker (frontend nginx e backend Go) em rede bridge `banco-net`, executando como usuário não-root `app` (`uid=100`).
- **Fonte de verdade de negócio:** Projeto original em `../SistemaBancario_entrega/SistemaBancario` (somente leitura; 55 testes JUnit e 15 cenários BDD preservados e portados).

*Fontes:* `.orca/PROJECT.md` §Objetivo, `docs/requisitos.md` §1, `docs/design-frontend.md`.

---

## 2. Fase atual e estado
- **Estado atual:** **Todas as fases P001 a P008 foram concluídas com êxito**.
- **Fase P008 (Redesign do frontend):** Concluída com sucesso. Código de implementação mergeado em `main` no commit `9b16905` (PR #8). PR #9 (`doc/p008`) contendo documentação técnica sincronizada, matriz de rastreabilidade (33 testes) e capturas visuais em `docs/img/` submetido para validação final.
- **Fases concluídas:** **P001, P002, P003, P004, P005, P006, P007 e P008**.

### Histórico Consolidado de Pull Requests (PR #1 a #9):
| PR | Branch de Origem | Título / Escopo | Commit Merge no `main` | Revisor | Status |
|---|---|---|---|---|---|
| **#1** | `codex/p002-dominio-backend` | P002: domínio e casos de uso | `b1b0601` | `agy` | Mergeado |
| **#2** | `codex/p003-persistencia-sqlite` | P003: persistência SQLite | `f9cddb1` | `agy` | Mergeado |
| **#3** | `codex/p004-api-http-bdd` | P004: API HTTP e BDD | `b12579b` | `agy` | Mergeado |
| **#4** | `codex/p005-frontend` | P005: frontend React | `912821f` | `agy` | Mergeado |
| **#5** | `codex/p006-docker` | P006: Docker e E2E | `6cfcd35` | `agy` | Mergeado |
| **#6** | `doc/entrega` | P007 / T062: documentação final, README e entrega | `cff678b` | `claude` | Mergeado |
| **#7** | `codex/p007-correcoes` | P007: correções de qualidade e segurança | `6972715` | `agy` | Mergeado |
| **#8** | `codex/p008-redesign` | P008: redesign do frontend | `9b16905` | `agy` / `claude` | Mergeado |
| **#9** | `doc/p008` | P008 / C-20261023-006: documentação do redesign e capturas | *(aguarda merge)* | `claude` | Aberto |

*Fontes:* Histórico git de `origin/main`, `.orca/EXEC.md`, `.orca/phases/*/PHASE.md`.

---

## 3. Tarefas ativas e alocação da equipe (Fase P008 Concluída)

| Agente | Papel | Tarefas | Contrato | Branch / Canal | Status |
|---|---|---|---|---|---|
| `claude` | Chief | Orquestração da P008 e supervisão final | — | canal: `run_632b4c0e3c2c` | Ativo |
| `codex` | Worker (programador) | P008: T080 a T084 (implementação e testes) | C-20261023-004 | `codex/p008-redesign` | Concluído (PR #8 mergeado) |
| `agy` | Tester-reviewer | Revisão técnica e visual de P008 (PR #8) | C-20261023-005 | `agy/review-p008` | Concluído |
| `agy-doc` | Documentarian + Summarizer | Documentação do redesign, capturas e SUMMARY | C-20261023-006 | `doc/p008` | Concluído (PR #9 aberto) |

*Fontes:* `.orca/phases/008-redesign-frontend/PHASE.md`, `.orca/contracts/active/C-20261023-006-agy-doc-p008.md`.

---

## 4. Escopo da Fase P008 (Redesign do Frontend — Realizado)
- **Diretrizes e Design Tokens (`docs/design-frontend.md`):**
  - **T080:** Implementação de tokens semânticos (`src/styles/tokens.css`), tema claro e escuro via `color-scheme: light dark` e `light-dark()`, app shell responsivo (barra lateral no desktop ≥ 960px, barra inferior no mobile < 960px) e componentes base (`Button`, `Card`, `Badge`, `Field`, `Dialog`, `Toast`, ícones SVG inline sem bibliotecas pesadas).
  - **T081:** Tela de **Visão Geral** com saldo total em destaque, cartões estatísticos de clientes/contas ativas e atalhos rápidos.
  - **T082:** Tela de **Contas** em grade responsiva de cartões, busca por ID e formulário transacional de **Transferência em 3 Passos** (1. Formulário com selects e saldos → 2. Revisão com prévia dos saldos → 3. Recibo com detalhes e confirmação).
  - **T083:** Tela de **Clientes** em tabela (desktop) e cartões (mobile), dialog de cadastro com validação imediata de idade (18–65 anos) e diálogo de confirmação para remoção.
  - **T084:** Conformidade com WCAG 2.2 AA (alvos clicáveis ≥ 44×44px, contraste mínimo 4.5:1, `prefers-reduced-motion`), expansão para 33 testes automatizados (Vitest/RTL/MSW) e teste E2E do Playwright gerando capturas de tela (claro/escuro, mobile/desktop) em `frontend/e2e/screenshots/`.
- **Restrição Crucial Respeitada (ADR-020):** Nenhuma nova dependência de runtime introduzida (apenas React e CSS moderno).

---

## 5. Catálogo de decisões arquiteturais (ADRs)

| ID | Resumo da Decisão | Origem |
|---|---|---|
| [ADR-001](docs/decisoes.md#adr-001) | Backend Go hexagonal (ports & adapters) lido como MVC. | Usuário |
| [ADR-002](docs/decisoes.md#adr-002) | SQLite com DAO e adapter em memória para testes rápidos. | Usuário |
| [ADR-003](docs/decisoes.md#adr-003) | Dinheiro em `float64` mantendo regra de saldo finito (paridade com original). | Usuário |
| [ADR-004](docs/decisoes.md#adr-004) | Frontend React + Vite em JavaScript (HTML/CSS/JS) sem TypeScript. | Chief (Claude) |
| [ADR-005](docs/decisoes.md#adr-005) | Driver SQLite puro Go (`modernc.org/sqlite`, sem CGO) gerando binário estático. | Chief (Claude) |
| [ADR-006](docs/decisoes.md#adr-006) | BDD em Go via `godog` com arquivos `.feature` em português. | Chief (Claude) |
| [ADR-007](docs/decisoes.md#adr-007) | 2 containers Docker na rede bridge `banco-net` orquestrados por `docker compose`. | Usuário |
| [ADR-008](docs/decisoes.md#adr-008) | Evidência de TDD no histórico git (commits RED/GREEN/REFACTOR). | Usuário |
| [ADR-009](docs/decisoes.md#adr-009) | Roteamento HTTP com a biblioteca padrão `net/http` do Go 1.22+. | Chief (Claude) |
| [ADR-010](docs/decisoes.md#adr-010) | Erros de transferência tipados retornados explicitamente pela API REST. | Chief (Claude) |
| [ADR-011](docs/decisoes.md#adr-011) | Transferência exige origem e destino ativos (condições 6 e 7 do R12). | Usuário |
| [ADR-012](docs/decisoes.md#adr-012) | Fluxo de entrega via branch e PR por fase com merge commit no `main`. | Usuário + Chief |
| [ADR-013](docs/decisoes.md#adr-013) | `docker compose` instalado no perfil do usuário (`~/.docker/cli-plugins`). | Chief (Claude) |
| [ADR-014](docs/decisoes.md#adr-014) | Cópia de `docs/` para `sistemabancariorefatorado/docs/` na T062 (P007). | Chief (Claude) |
| [ADR-015](docs/decisoes.md#adr-015) | Manter Go 1.25; fixar `modernc.org/sqlite` em **v1.58.0** (compatível com Go 1.25). | Chief (Claude) |
| [ADR-016](docs/decisoes.md#adr-016) | Casos de uso agrupados em `servico.go` por contexto delimitado (cliente, conta). | Chief (Claude) |
| [ADR-017](docs/decisoes.md#adr-017) | Componentização por responsabilidade (arquivos ≲150 linhas), Prettier e versões exatas. | Chief (Claude) |
| [ADR-018](docs/decisoes.md#adr-018) | Bloqueio de transferência para a mesma conta (422 `mesma_conta`, condição 8 do R12). | Chief (Claude) |
| [ADR-019](docs/decisoes.md#adr-019) | Endurecimento da API e Nginx: limite de 1 MiB (413), timeouts, id > 0 (422), WAL e headers. | Chief (Claude) |
| [ADR-020](docs/decisoes.md#adr-020) | Redesign do frontend (P008) conforme `docs/design-frontend.md`: tokens semânticos em CSS, tema claro/escuro com `light-dark()`, app shell com 4 seções, transferência em 3 passos (formulário → revisão → recibo), moeda BRL via `Intl.NumberFormat`, ícones SVG próprios; **sem novas dependências de runtime**. | Usuário + Chief |

*Fontes:* `docs/decisoes.md`.

---

## 6. Fatos essenciais de arquitetura
- **Topologia:** Navegador (`:3000`) → Nginx (frontend SPA e proxy reverso para `/api/`) → Rede bridge `banco-net` → Go (`:8080`, backend) → SQLite (`/data/banco.db` em volume `banco-data`, modo WAL).
- **Segurança de Runtime:** Containers multi-stage com usuário não-root `app` (`uid=100`), PID em `/tmp`, isolamento da porta 8080 no host e headers de proteção no Nginx.
- **Cobertura de Testes Atual:**
  - 31 funções/suítes de teste automatizadas no backend Go (unidade, contratos, SQLite com WAL e HTTP).
  - 18 cenários BDD godog (85 steps) em português.
  - 33 testes automatizados no frontend (Vitest + React Testing Library + MSW) em 6 suítes cobrindo formato, base, acessibilidade, clientes, contas e fluxos completos de aplicação.
  - Teste ponta a ponta Playwright cobrindo o fluxo bancário completo nos containers Docker e gerando capturas visuais para evidência em desktop e mobile nos temas claro e escuro.

*Fontes:* `docs/arquitetura.md`, `docs/infra-docker.md`, `docs/design-frontend.md`, `docs/requisitos.md`.

---

## 7. Riscos residuais e limitações conhecidas
- **Ponto flutuante para valores monetários (`float64`):** Mantido por estrita paridade com o sistema original em Java ([ADR-003](docs/decisoes.md#adr-003)). Embora salvaguardas de saldo finito (`math.IsNaN`, `math.IsInf`) tenham sido implementadas para evitar estouro numérico, o tipo não substitui tipos decimais de precisão arbitrária recomendados para sistemas bancários de grande escala.
- **Mensagens de erro do backend sem acentuação:** As mensagens textuais de erro retornadas pela API REST em Go não possuem acentuação gráfica (por exemplo: `"cliente nao encontrado"`, `"conta nao encontrada"` ou `"identificador duplicado"`), embora os códigos de status HTTP e os identificadores JSON sejam estruturados e consistentes. O frontend mapeia os erros para português com acentuação via `src/lib/erros.js`.
- **Ausência de autenticação e controle de acesso:** O sistema não implementa autenticação (tokens/sessões) ou perfis de autorização, uma vez que tais controles estavam fora do escopo do sistema de console legado.
- **Acessibilidade sem auditoria formal:** A interface foi construída seguindo boas práticas e critérios da WCAG 2.2 AA definidos na especificação de design (alvos ≥ 44px, foco visível, contraste, rótulos e estados com ícone + texto), sem auditoria formal independente ou certificação.
- **Escala horizontal de instâncias:** O banco embutido SQLite com volume local opera adequadamente com uma única instância de backend.

---

## 8. Bloqueios e pendências
- **Nenhum bloqueio técnico.** Todas as fases P001 a P008 foram completadas. PR #9 aguarda apenas validação e merge final pelo Chief `claude`.

---

## 9. Próximos passos
1. Validação final e merge do PR #9 pelo Chief `claude`.
2. Equipe em standby.
