# Sistema Bancário Refatorado

> Aplicação web cliente-servidor para gerenciamento bancário e transferências atômicas, refatorada a partir de um sistema de console em Java 8. Desenvolvida com metodologias de engenharia de software (**TDD**, **BDD**, **DDD**, **Clean Architecture** e **Arquitetura Hexagonal**) e coordenada pelo usuário com o protocolo **ORCA**.

---

## 1. Visão Geral do Projeto

O objetivo principal deste projeto é modernizar a arquitetura e a experiência de uso de um sistema bancário legado, originalmente implementado em Java 8 como aplicação de console monolítica, transformando-o em uma aplicação cliente-servidor distribuída:

- **Backend:** Desenvolvido em **Go 1.25** adotando arquitetura hexagonal (*ports & adapters*) e princípios de MVC, sem frameworks pesados de roteamento, priorizando concisão e compilação estática.
- **Frontend:** Desenvolvido em **React + Vite** com JavaScript moderno (HTML5/CSS3/ES6+) sem TypeScript ([ADR-004](docs/decisoes.md#adr-004)), componentização estrita por responsabilidade ([ADR-017](docs/decisoes.md#adr-017)) e foco em acessibilidade.
- **Persistência de Dados:** Base relacional **SQLite** acessada via Data Access Object (DAO) utilizando driver puro Go (`modernc.org/sqlite v1.58.0`, sem necessidade de CGO, [ADR-005](docs/decisoes.md#adr-005), [ADR-015](docs/decisoes.md#adr-015)), acompanhada de adaptador em memória (`memory`) com clonagem defensiva para testes rápidos.
- **Transacionalidade e Atomicidade:** Operações de transferência atômica com reversão integral (*rollback*) em caso de falhas, coordenadas pelo padrão *Unit of Work*.
- **Infraestrutura e Orquestração:** Empacotamento em **2 containers Docker** orquestrados por `docker compose`, executando como usuários de sistema sem privilégios de root (`app`, `uid=100`) em rede interna isolada `banco-net`.
- **Regras e Testes Portados do Original:** As regras de negócio e os testes do sistema legado Java 8 (`../SistemaBancario_entrega/SistemaBancario`, mantido como especificação somente leitura) foram portados e validados no backend e frontend:
  - 55 testes JUnit originais → portados para testes unitários em `backend/internal/domain/`, testes de contrato em `backend/tests/contract/` e testes HTTP em `backend/internal/adapters/http/`.
  - 15 cenários BDD originais + 2 cenários adicionais para contas inativas ([ADR-011](docs/decisoes.md#adr-011)) → portados para `backend/features/` e executados via `godog` em `backend/tests/bdd/`.

---

## 2. Arquitetura do Sistema

A arquitetura adota o padrão **Hexagonal (Ports & Adapters)** combinado com a semântica **MVC**:

```
                              ┌────────────────────────────────────────┐
                              │            Navegador Web               │
                              │       http://localhost:3000            │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 │ HTTP
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Container Frontend (nginx:1.29-alpine — uid 100)                                       │
│                                                                                        │
│   ┌───────────────────────────┐         ┌──────────────────────────────────────────┐   │
│   │   SPA React 19 (Vite)     │ ──────> │              Nginx Proxy                 │   │
│   │   Assets estáticos HTML/JS│         │   proxy_pass http://backend:8080/api/    │   │
│   └───────────────────────────┘         └────────────────────┬─────────────────────┘   │
└──────────────────────────────────────────────────────────────┼─────────────────────────┘
                                                               │ Rede bridge (banco-net)
                                                               │ (porta 8080 interna)
                                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Container Backend (alpine:3.22 com binário estático Go — uid 100)                      │
│                                                                                        │
│  [Adapters - Driving]                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ HTTP Controller (net/http Go 1.22+)                                              │  │
│  │ /api/health  |  /api/clientes  |  /api/contas  |  /api/transferencias             │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │ Invoca casos de uso                       │
│  [Application Services]                    ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ cliente.Servico  |  conta.Servico (Transferência com Unit of Work)               │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │ Orquestra regras                          │
│  [Domain Entities & Rules]                 ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Cliente (Idade 18-65) | ContaCorrente (Saldo Finito) | Transferencia (Atomicidade)│  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │ Utiliza portas                            │
│  [Ports & Driven Adapters]                 ▼                                           │
│  ┌───────────────────────────────┬──────────────────────────────────────────────────┐  │
│  │ backend/internal/application/ │ SQLite DAO Adapter (modernc.org/sqlite v1.58.0)  │  │
│  │ ports (ClienteRepository,     │ Memory DAO Adapter (com cópias defensivas)       │  │
│  │ ContaRepository, UnitOfWork)  │                                                  │  │
│  └───────────────────────────────┴──────────────────────────┬───────────────────────┘  │
└─────────────────────────────────────────────────────────────┼──────────────────────────┘
                                                              │ Grava dados
                                                              ▼
                                            ┌──────────────────────────────────┐
                                            │ Volume Persistente (banco-data)  │
                                            │ Arquivo SQLite: /data/banco.db   │
                                            └──────────────────────────────────┘
```

### 2.1 Backend em Go (`backend/`)
- **`internal/domain/`:** Entidades de domínio (`cliente`, `conta`), regras invariantes (idade válida entre 18 e 65 anos, saldo sempre finito em `float64`), erros tipados de transferência (`saldo_insuficiente`, `valor_invalido`, `conta_origem_nao_encontrada`, `conta_destino_nao_encontrada`, `conta_origem_inativa`, `conta_destino_inativa`) e validações de unicidade.
- **`internal/application/ports/`:** Contratos de abstração de dados (`ClienteRepository`, `ContaRepository`) e controle transacional (`UnitOfWork`).
- **`internal/application/`:** Serviços de aplicação (`cliente.Servico` e `conta.Servico`), organizados por contexto delimitado ([ADR-016](docs/decisoes.md#adr-016)). Implementam os casos de uso de negócio e coordenam transações atômicas de transferência.
- **`internal/adapters/sqlite/`:** Adaptador de persistência durável em SQLite com operações preparadas e controle transacional (`BEGIN`, `COMMIT`, `ROLLBACK`).
- **`internal/adapters/memory/`:** Adaptador em memória com cópias defensivas (`Copia()`) para isolamento estrito de referências em suítes de teste de unidade.
- **`internal/adapters/http/`:** Controlador HTTP construído com roteamento nativo do Go 1.22 (`net/http`), mapeamento JSON e conversão de erros de domínio em códigos de status HTTP sem vazamento de abstração.
- **`internal/seed/`:** Carga inicial idempotente de dados (clientes e contas padrão).
- **`cmd/api/main.go`:** Ponto de entrada (*composition root*) com graceful shutdown de 5 segundos via sinais `SIGINT`/`SIGTERM`.

### 2.2 Frontend em React (`frontend/`)
- **`src/features/clientes/`:** Componentes independentes para consulta, cadastro com validação de idade (18 a 65 anos) e listagem/gerenciamento de clientes.
- **`src/features/contas/`:** Componentes desacoplados para consulta de saldo, cadastro de conta, gerenciamento de situação (ativa/inativa) e formulário transacional de transferência.
- **`src/hooks/useMensagem.js`:** Hook para gerenciar estado local de feedback (`mensagem`, flag booleana `erro` e função `avisar(texto, falhou)`).
- **`src/components/Mensagem.jsx`:** Componente de alerta que renderiza `<p role={erro ? "alert" : "status"}>{texto}</p>` quando há mensagem definida.
- **`src/features/*/componentes.test.jsx` e `tests/app.test.jsx`:** Suíte completa de testes de componentes e integração utilizando **Vitest**, **React Testing Library** e **Mock Service Worker (MSW)** cobrindo renderização, formulários, ações de tela e tratamento de erros tipados da API.
- **`e2e/fluxo-bancario.spec.js`:** Testes ponta a ponta reais com **Playwright** executando contra o ambiente conteinerizado.

---

## 3. Como Executar a Aplicação

### 3.1 Pré-requisitos
- **Docker** e **Docker Compose** instalados na máquina.

### 3.2 Inicialização com Docker Compose
Para compilar as imagens e iniciar os serviços em segundo plano:

```bash
docker compose up --build
```

> **Dica para ambiente Linux:** Se o seu usuário foi adicionado recentemente ao grupo `docker` e a sessão de terminal atual ainda não foi renovada, execute:
> ```bash
> sg docker -c "docker compose up --build"
> ```

### 3.3 Acesso aos Serviços
- **Aplicação Web (Interface do Usuário):** [http://localhost:3000](http://localhost:3000)
- **Endpoint de Saúde (Healthcheck via Nginx):** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **API REST (Clientes):** [http://localhost:3000/api/clientes](http://localhost:3000/api/clientes)
- **API REST (Contas):** [http://localhost:3000/api/contas](http://localhost:3000/api/contas)

*Nota de Segurança:* Por arquitetura, a porta `8080` do backend não é publicada no computador hospedeiro (*host*). O backend comunica-se exclusivamente com o Nginx através da rede interna `banco-net`.

### 3.4 Encerramento dos Containers
Para interromper os containers preservando os dados cadastrados:
```bash
docker compose down
```

Para interromper e **limpar o volume de dados** (`banco-data`), reiniciando o banco a partir do seed original:
```bash
docker compose down -v
```

---

## 4. Como Executar os Testes

O projeto conta com suítes de teste automatizadas cobrindo todos os níveis da pirâmide de testes.

### 4.1 Testes do Backend (Unidade, Contratos e HTTP)
Executa a suíte de testes unitários do domínio, testes de conformidade de contrato entre repositórios SQLite/Memória e testes de integração HTTP via `httptest`:
```bash
cd backend
go test -v ./...
```

### 4.2 Testes de BDD (Gherkin em Português)
Executa os 17 cenários de teste orientados a comportamento (Behavior-Driven Development) utilizando `godog`:
```bash
cd backend
go test -v ./tests/bdd
```

### 4.3 Testes do Frontend (Vitest + RTL + MSW)
Executa os 26 testes de comportamento e renderização de componentes de interface com mocks de rede MSW:
```bash
cd frontend
npm test
```

### 4.4 Testes Ponta a Ponta (Playwright E2E)
Executa o fluxo completo de ponta a ponta no navegador contra os containers ativos em `http://localhost:3000`:
```bash
# Certifique-se de que a aplicação está rodando (docker compose up)
cd frontend
npm run e2e
```

---

## 5. Matriz de Rastreabilidade (Requisito → Testes)

Todos os requisitos funcionais originais do sistema bancário (R01 a R12) e as extensões acordadas foram formalmente mapeados e validados nas suítes automatizadas:

| Requisito | Descrição | Testes no Backend (Go) | Testes no Frontend (Vitest/MSW) | Testes E2E (Playwright) | Status |
|---|---|---|---|---|---|
| **R01** | Consultar cliente por ID | `application/cliente/casos_de_uso_test.go`<br>`features/consultar_cliente.feature`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (consulta existente e 404) | — | Concluído |
| **R02** | Cadastrar novo cliente | `application/cliente/casos_de_uso_test.go`<br>`tests/contract/contratos_test.go`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (cadastro numérico e id duplicado) | `e2e/fluxo-bancario.spec.js` (cadastro pela interface) | Concluído |
| **R03** | Validar idade do cliente (18 a 65 anos) | `domain/cliente/cliente_test.go`<br>`application/cliente/operacoes_test.go`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (menor 18, limite 18 OK, 66 rejeitado) | — | Concluído |
| **R04** | Ativar cliente | `domain/cliente/cliente_test.go`<br>`application/cliente/operacoes_test.go`<br>`features/ativar_cliente.feature`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de ativação na listagem) | — | Concluído |
| **R05** | Desativar cliente | `domain/cliente/cliente_test.go`<br>`application/cliente/operacoes_test.go`<br>`features/desativar_cliente.feature`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de desativação na listagem) | — | Concluído |
| **R06** | Exibir situação do cliente | `application/cliente/operacoes_test.go`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (exibição de Ativo/Inativo) | — | Concluído |
| **R07** | Remover cliente | `application/cliente/casos_de_uso_test.go`<br>`adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de remoção na listagem) | — | Concluído |
| **R08** | Consultar conta corrente por ID | `application/conta/servico_test.go`<br>`features/consultar_conta.feature`<br>`adapters/http/router_test.go` | `contas/componentes.test.jsx` (consulta existente e 404) | — | Concluído |
| **R09** | Cadastrar nova conta corrente | `domain/conta/conta_test.go`<br>`application/conta/servico_test.go`<br>`tests/contract/contratos_test.go`<br>`adapters/http/router_test.go` | `contas/componentes.test.jsx` (cadastro numérico e id duplicado) | `e2e/fluxo-bancario.spec.js` (cadastro pela interface) | Concluído |
| **R10** | Exibir e consultar situação da conta | `domain/conta/conta_test.go`<br>`application/conta/operacoes_test.go`<br>`adapters/http/router_test.go` | `contas/componentes.test.jsx` (exibição e consulta de Ativa/Inativa) | — | Concluído |
| **R11** | Remover conta corrente | `application/conta/operacoes_test.go`<br>`adapters/http/router_test.go` | `contas/componentes.test.jsx` (ação de remoção na listagem) | — | Concluído |
| **R12** | Transferir valores entre contas com atomicidade e reversão | `domain/conta/transferencia_test.go`<br>`exploratorio_test.go`<br>`application/conta/servico_test.go`<br>`transferencia_uow_test.go`<br>`features/transferir_valores.feature`<br>`adapters/http/router_test.go` | `contas/componentes.test.jsx` (sucesso e atualização de saldos)<br>`tests/app.test.jsx` (6 erros tipados) | `e2e/fluxo-bancario.spec.js` (transferência ponta a ponta e checagem de saldos) | Concluído |

---

## 6. Desenvolvimento com Inteligência Artificial e Metodologia Multi-Agente (ORCA)

Este projeto foi conduzido por uma equipe de agentes autônomos de Inteligência Artificial coordenada pelo usuário através do protocolo **ORCA**:

### 6.1 Papéis e Especialização da Equipe
- **Chief Architect / Coordinator (`claude` — Claude Opus 5.5):** Responsável pela arquitetura do sistema, planejamento de fases (P001 a P007), elaboração dos contratos de trabalho, supervisão contínua do ciclo de entrega, decisões de ADR e merge final dos Pull Requests.
- **Software Engineer / Implementer (`codex` — gpt-5.6-terra e posteriormente gpt-5.6-luna, alternado por limite de uso):** Responsável pela codificação do backend em Go, suítes de teste, cenários BDD em `godog`, frontend React/Vite, Dockerfiles e testes Playwright E2E.
- **Tester & Code Reviewer (`agy` — Antigravity CLI com Gemini 4 Argon / Gemini 3.8 Flash):** Revisor independente atuando em worktree isolado. Conduziu análises estáticas e dinâmicas, validação de critérios de aceite contra commits do branch e aplicação de pedidos de alteração (`CHANGES_REQUESTED`) perante inconsistências.
- **Documentarian & Summarizer (`agy-doc` — Antigravity CLI com Gemini 4 Argon / Gemini 3.8 Flash):** Responsável pela rastreabilidade contínua, auditoria de conformidade entre código e documentação, manutenção do grafo de conhecimento (Graphify), síntese do projeto (`SUMMARY.md`), catálogo de lições aprendidas (`LESSONS_LEARNED.md`) e documentação final de entrega.

### 6.2 Disciplina e Rastreabilidade do TDD no Histórico Git
Conforme estipulado no [ADR-008](docs/decisoes.md#adr-008), a evidência do desenvolvimento guiado por testes baseia-se no histórico auditável de commits do repositório:
- Commits `test: RED`: Introduzem testes automatizados com falha antes da implementação do recurso.
- Commits `feat: GREEN`: Fornecem a implementação funcional mínima para aprovação dos testes.
- Commits `refactor`: Limpam e organizam a base preservando o comportamento observável.

A maior parte das funcionalidades seguiu a alternância RED → GREEN. Conforme apontado nas revisões de código e registrado nas lições aprendidas (L-006), alguns commits de rotas e composição entraram sem commit RED predecessor (`be26f9d`, `afe8128`, `1ef9896`, `d682c9e` na fase P004 e `cce754d` na fase P005), tendo suas coberturas de teste consolidadas em commits subsequentes.

---

## 7. Limitações Conhecidas

- **Ponto flutuante para valores monetários (`float64`):** Mantido por paridade com o sistema original em Java ([ADR-003](docs/decisoes.md#adr-003)). Embora salvaguardas de saldo finito (`math.IsNaN`, `math.IsInf`) tenham sido implementadas para rejeitar estouros numéricos, o tipo não substitui tipos decimais de precisão arbitrária recomendados para sistemas bancários de grande escala.
- **Mensagens de erro do backend sem acentuação:** As mensagens textuais de erro retornadas pela API REST em Go não possuem acentuação gráfica (por exemplo: `"cliente nao encontrado"`, `"conta nao encontrada"` ou `"identificador duplicado"`), embora os códigos de status HTTP e os identificadores JSON sejam estruturados e consistentes.
- **Ausência de autenticação e controle de acesso:** O sistema não implementa autenticação (tokens/sessões) ou perfis de autorização, uma vez que tais controles estavam fora do escopo do sistema de console legado.

---

## 8. Documentação Técnica Detalhada

A pasta [`docs/`](docs/) contém o conjunto integral de especificações técnicas do projeto:

- [`docs/requisitos.md`](docs/requisitos.md): Detalhamento formal dos requisitos de negócio (R01 a R12), regras não funcionais e dados iniciais de seed.
- [`docs/arquitetura.md`](docs/arquitetura.md): Desenho arquitetural do backend hexagonal, frontend componentizado e padrões de projeto.
- [`docs/decisoes.md`](docs/decisoes.md): Catálogo completo das 17 Decisões Arquiteturais registradas (ADR-001 a ADR-017).
- [`docs/api.md`](docs/api.md): Especificação completa dos contratos HTTP REST, payloads de entrada/saída e códigos de erro tipados.
- [`docs/infra-docker.md`](docs/infra-docker.md): Especificação dos containers multi-stage, topologia de rede, healthcheck e persistência.
- [`docs/estrategia-testes.md`](docs/estrategia-testes.md): Pirâmide de testes, cobertura por camadas e comandos de execução.
