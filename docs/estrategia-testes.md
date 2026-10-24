# Estratégia de testes

O original organizava os testes por técnica (`tdd/`, `bdd/`, `ddd/`). Aqui as três técnicas são
mantidas, cada uma onde faz mais sentido na arquitetura nova.

## 1. Pirâmide

| Nível | Ferramenta | O que cobre | Onde |
|---|---|---|---|
| Unidade de domínio (TDD/DDD) | `go test` + `testing` (tabela de casos) | Regras de Cliente, Conta e Transferência | `internal/domain/**/*_test.go` |
| Casos de uso | `go test` + repositório em memória | Orquestração, erros, idempotência | `internal/application/**/*_test.go` |
| Contrato de repositório | `go test` (mesma suíte para os 2 adapters) | Memory e SQLite se comportam igual | `tests/contract/` |
| API HTTP | `net/http/httptest` | Rotas, JSON, mapeamento erro → status | `internal/adapters/http/*_test.go` |
| BDD (aceitação) | **godog** (Cucumber para Go), Gherkin em português | Os 15 cenários do original + novos | `features/` + `tests/bdd/` |
| Frontend: componentes e design system | **Vitest** + **React Testing Library** | Componentes base, a11y, formulários, formatação e features | `frontend/src/**/*.test.{js,jsx}` |
| Frontend: integração | Vitest + **MSW** (mock da API) | Navegação, fluxo guiado de transferência e erros | `frontend/tests/**/*.test.jsx` |
| E2E e regressão visual | **Playwright** contra o `docker compose` | Fluxo completo ponta a ponta e capturas visuais (desktop/mobile, claro/escuro) | `frontend/e2e/` |

## 2. TDD — como registrar

Ciclo obrigatório para os requisitos TDD (R02, R03, R09, R12) e para todo código novo de domínio:

1. **RED**: escrever o teste, rodar e ver falhar → commit `test(R12): RED - nao deve transferir valor zero`
2. **GREEN**: implementar o mínimo → commit `feat(R12): GREEN - ...`
3. **REFACTOR**: limpar sem mudar o comportamento, com a suíte verde → commit `refactor(R12): ...`

A evidência é **só o histórico git** (decisão do usuário, 2026-10-22, ver [ADR-008](decisoes.md#adr-008)). Sem logs em arquivo.

## 3. BDD

- Os 5 arquivos `.feature` do original (`consultar_cliente`, `ativar_cliente`, `desativar_cliente`,
  `consultar_conta`, `transferir_valores`) são copiados com `# language: pt` e os mesmos passos.
- Os steps chamam a **camada de aplicação** (rápido e determinístico). Opcional: um segundo runner contra a API HTTP.
- Novos cenários: situação/remoção pela API e mensagens de erro da transferência.

## 4. DDD

- Testes de modelagem (R06, R07, R10, R11): situação como tipo próprio; inexistente ≠ inativo;
  remover cliente não remove a conta.
- A linguagem ubíqua em português é mantida nos nomes (`Cliente`, `ContaCorrente`, `Transferir`, `Situacao`).

## 5. Portar os testes originais (checklist e rastreabilidade real)

| Original (Java) | Destino planejado | Arquivo real implementado em Go | Status |
|---|---|---|---|
| `tdd/CadastroClienteTest` | `application/cliente/cadastrar_test.go` | `internal/application/cliente/casos_de_uso_test.go` | Concluído (P002) |
| `tdd/ValidacaoIdadeClienteTest` | `domain/cliente/idade_test.go` | `internal/domain/cliente/cliente_test.go`, `internal/application/cliente/operacoes_test.go` | Concluído (P002) |
| `tdd/CadastroContaCorrenteTest` | `application/conta/cadastrar_test.go` | `internal/application/conta/servico_test.go` | Concluído (P002) |
| `tdd/TransferenciaTest` | `domain/conta/transferencia_test.go` | `internal/domain/conta/transferencia_test.go`, `internal/application/conta/servico_test.go` | Concluído (P002) |
| `tdd/UnicidadeIdentificadorTest` | `tests/contract/` | `internal/application/cliente/casos_de_uso_test.go`, `tests/contract/memory_test.go`, `sqlite_test.go` | Concluído (P002/P003) |
| `tdd/SaldoFinitoTest` | `domain/conta/saldo_test.go` | `internal/domain/conta/conta_test.go` | Concluído (P002) |
| `ddd/SituacaoClienteTest` | `domain/cliente/situacao_test.go` | `internal/application/cliente/operacoes_test.go` | Concluído (P002) |
| `ddd/SituacaoContaCorrenteTest` | `domain/conta/situacao_test.go` | `internal/domain/conta/conta_test.go`, `internal/application/conta/operacoes_test.go` | Concluído (P002) |
| `ddd/RemocaoTest` | `application/*/remover_test.go` | `internal/application/cliente/casos_de_uso_test.go`, `internal/application/conta/operacoes_test.go` | Concluído (P002) |
| `bdd/*.feature` (15 originais + 3 novas) | `features/*.feature` | `features/*.feature` + `tests/bdd/bdd_test.go` (18 cenários, 85 steps godog) | Concluído (P004/P007) |
| `teste/TesteUnitarioManual` | não portar | — | Não portar (substituído pela automação) |
| — (novo: persistência & isolamento) | `adapters/memory/*_test.go` | `internal/adapters/memory/repositorios_test.go`, `persistencia_test.go`, `unit_of_work_test.go` | Concluído (P002/P003) |
| — (novo: adapter SQLite com WAL) | `adapters/sqlite/*_test.go` | `internal/adapters/sqlite/repositorios_test.go`, `conta_repositorio_test.go`, `unit_of_work_test.go` | Concluído (P003/P007) |
| — (novo: UoW transferência) | `application/conta/*_test.go` | `internal/application/conta/transferencia_uow_test.go`, `servico_test.go` | Concluído (P003/P007) |
| — (novo: carga inicial idempotente) | `internal/seed/*_test.go` | `internal/seed/seed_test.go` (Memory + SQLite) | Concluído (P003) |
| — (novo: suíte de contrato parametrizada) | `tests/contract/*_test.go` | `tests/contract/contratos_test.go`, `memory_test.go`, `sqlite_test.go` | Concluído (P003) |
| — (novo: rotas REST, handlers desacoplados e segurança) | `internal/adapters/http/*_test.go` | `internal/adapters/http/router_test.go` (httptest cobrindo rotas, erros, 413 corpo grande e mesma conta) | Concluído (P004/P007) |
| — (novo: validação e segurança no domínio) | `domain/cliente/*_test.go` | `internal/domain/cliente/cliente_security_test.go`, `cliente_test.go` | Concluído (P007) |
| — (novo: utilitários de formatação frontend) | `frontend/src/lib/*.test.js` | `src/lib/formato.test.js` (1 teste: formatação monetária BRL determinística) | Concluído (P008) |
| — (novo: componentes base do design system) | `frontend/src/components/*.test.jsx` | `src/components/base.test.jsx` (3 testes: renderização de Botao, Card, Campo, Badge, Toast, Modal) | Concluído (P008) |
| — (novo: acessibilidade a11y dos componentes) | `frontend/src/components/*.test.jsx` | `src/components/a11y.test.jsx` (3 testes: roles semânticos, foco em modais, labels acessíveis) | Concluído (P008) |
| — (novo: componentes frontend de clientes) | `frontend/src/features/clientes/*.test.jsx` | `src/features/clientes/componentes.test.jsx` (10 testes: formulário, validações, listagem, filtros e ações) | Concluído (P005/P008) |
| — (novo: componentes frontend de contas) | `frontend/src/features/contas/*.test.jsx` | `src/features/contas/componentes.test.jsx` (8 testes: abertura, listagem, fluxo guiado de transferência em 3 passos) | Concluído (P005/P008) |
| — (novo: integração frontend e erros MSW) | `frontend/tests/*.test.jsx` | `tests/app.test.jsx` (8 testes: navegação por abas, fluxo guiado com revisão/recibo e motivos de recusa da API) | Concluído (P005/P008) |
| — (novo: E2E Playwright e capturas visuais) | `frontend/e2e/*.spec.js` | `e2e/fluxo-bancario.spec.js` (fluxo bancário completo na stack Docker e geração de capturas para evidência visual) | Concluído (P006/P008) |

## 6. Comandos (alvo)

```bash
cd backend && go test ./...            # unidade + contrato + http
cd backend && go test ./tests/bdd/...  # BDD (godog)
cd frontend && npm test                # Vitest (testes de componentes e integração MSW)
cd frontend && npm run e2e             # Playwright (teste E2E contra containers Docker ativos)
docker compose up --build             # aplicação completa
```
