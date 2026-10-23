# Registro de decisões (ADR)

| ID | Data | Decisão | Origem |
|---|---|---|---|
| <a id="adr-001"></a>ADR-001 | 2026-10-22 | Backend em Go com arquitetura hexagonal (ports & adapters), lida como MVC: domain = Model, handlers HTTP = Controller, React + DTOs = View. | Usuário |
| <a id="adr-002"></a>ADR-002 | 2026-10-22 | Persistência em SQLite atrás de portas de repositório (DAO); adapter em memória para testes. | Usuário |
| <a id="adr-003"></a>ADR-003 | 2026-10-22 | Dinheiro em `float64`, como no original (paridade). A regra de "saldo sempre finito" é mantida. Limitação conhecida: sem exatidão decimal (0.1 + 0.2). | Usuário |
| <a id="adr-004"></a>ADR-004 | 2026-10-22 | Frontend em React + Vite, **JavaScript** (sem TypeScript) para manter a simplicidade pedida (HTML/CSS/JS). Testes com Vitest + React Testing Library + MSW. | Chief (Claude) |
| <a id="adr-005"></a>ADR-005 | 2026-10-22 | Driver SQLite `modernc.org/sqlite` (puro Go, sem CGO) → imagem Docker estática e menor. | Chief (Claude) |
| <a id="adr-006"></a>ADR-006 | 2026-10-22 | BDD no Go com `godog`, mantendo os `.feature` do original em português. | Chief (Claude) |
| <a id="adr-007"></a>ADR-007 | 2026-10-22 | "2 VMs" = 2 containers (frontend nginx + backend Go) numa rede Docker bridge via `docker compose`. | Usuário |
| <a id="adr-008"></a>ADR-008 | 2026-10-22 | Evidência do TDD só pelo histórico git: um commit por etapa RED/GREEN/REFACTOR. | Usuário |
| <a id="adr-009"></a>ADR-009 | 2026-10-22 | Roteamento HTTP com a `net/http` padrão (Go ≥ 1.22 aceita método + padrão de rota), sem framework. | Chief (Claude) |
| <a id="adr-010"></a>ADR-010 | 2026-10-22 | Os erros de transferência viram erros tipados (motivo explícito) em vez do `boolean` do original; a API retorna o motivo. | Chief (Claude) |
| <a id="adr-011"></a>ADR-011 | 2026-10-22 | Transferência exige origem **e** destino com situação **Ativa** (novas condições 6 e 7 do R12; erros `ErrContaOrigemInativa`/`ErrContaDestinoInativa` → 422). Diverge do original de propósito. | Usuário |
| <a id="adr-012"></a>ADR-012 | 2026-10-22 | Fluxo de entrega: um branch e um Pull Request por fase (`codex/p00N-*` → `main`); revisão do agy no PR; o codex avalia e aceita/recusa cada observação com justificativa; o Chief faz o merge com `--merge` (preserva os commits RED/GREEN/REFACTOR). | Usuário + Chief |
| <a id="adr-013"></a>ADR-013 | 2026-10-22 | `docker compose` v5.6.1 instalado como plugin do usuário (`~/.docker/cli-plugins`); usuário adicionado ao grupo `docker` em 2026-10-22. Terminais abertos antes disso devem rodar Docker como `sg docker -c "docker compose ..."` (ou após novo login, direto). | Chief (Claude) |
| <a id="adr-014"></a>ADR-014 | 2026-10-22 | `docs/` será copiado para `sistemabancariorefatorado/docs/` na T062 (o plano passa a ser versionado junto com o código na entrega). | Chief (Claude) |
| <a id="adr-015"></a>ADR-015 | 2026-10-22 | Manter Go 1.25; fixar `modernc.org/sqlite` numa versão compatível com Go 1.25 (efetiva: **v1.58.0**; v1.60+ exige Go 1.26). | Chief (Claude) |
| <a id="adr-016"></a>ADR-016 | 2026-10-22 | Casos de uso agrupados em um `servico.go` por contexto (cliente, conta) em vez de um arquivo por caso de uso, **desde que** cada arquivo fique pequeno (≲150 linhas) e coeso; acima disso, dividir. `docs/arquitetura.md` passa a refletir a estrutura real. | Chief (Claude) |
| <a id="adr-017"></a>ADR-017 | 2026-10-23 | Frontend: um componente por responsabilidade (lista, formulário de cadastro, consulta, validação de idade, transferência) e hook `useMensagem`; código formatado de forma legível (uma instrução por linha, sem linhas longas encadeadas), funções curtas; dependências com **versão exata** no `package.json` (sem `latest`/`^`), `package-lock.json` versionado. | Chief (Claude) |

Decisões novas entram aqui com data e origem. Mudar uma decisão do usuário exige confirmação dele.
