# Testes novos

Testes que **não existiam** no sistema original. Surgiram porque o sistema mudou: agora tem
regras novas de transferência, banco SQLite, API HTTP, frontend React e containers Docker. Os testes
que vieram do Java estão em [testes-migrados.md](testes-migrados.md).

| Camada | Ferramenta | Testes novos |
|---|---|---|
| Domínio e casos de uso (Go) | `go test` | 5 funções + 2 casos novos numa tabela migrada |
| Persistência: memória, SQLite, contrato, seed (Go) | `go test` | 9 funções |
| API HTTP (Go) | `net/http/httptest` | 6 funções |
| BDD (Go) | godog | 3 cenários |
| Frontend | Vitest + React Testing Library + MSW | 33 testes em 6 arquivos |
| Ponta a ponta | Playwright contra o `docker compose` | 2 testes |

Caminhos Go relativos a `backend/`; caminhos do frontend relativos a `frontend/`.

## Ferramentas por tipo de teste

| Tipo | Ferramenta (versão) | Para que serve | Onde e como roda |
|---|---|---|---|
| **TDD / unidade (backend)** | Pacote **`testing`** do Go 1.25 | Testar regras do domínio e casos de uso, um comportamento por teste, com tabelas de casos e `t.Run` | `internal/**/*_test.go` · `go test ./...` |
| **DDD (backend)** | `testing` + `errors.Is` | Conferir a linguagem do domínio: situação como tipo próprio, inexistente ≠ inativo, erros tipados | `internal/domain`, `internal/application` |
| **BDD (backend)** | **godog v0.15.1** (Cucumber para Go), Gherkin em português | Cenários "Dado / Quando / Então" legíveis por quem não programa; os steps chamam os casos de uso | `features/*.feature` + `tests/bdd/bdd_test.go` · `go test ./tests/bdd/` |
| **Contrato de repositório** | `testing` + **modernc.org/sqlite v1.58.0** (SQLite em Go puro) | Rodar **a mesma suíte** no adapter de memória e no SQLite | `tests/contract` |
| **Banco e transação** | `testing` + SQLite em memória (`:memory:`) ou arquivo temporário (`t.TempDir()`) | Migração do schema, gravação, rollback da Unit of Work, seed idempotente | `internal/adapters/sqlite`, `internal/seed` |
| **API HTTP** | **`net/http/httptest`** (biblioteca padrão) | Chamar o roteador sem abrir porta: `httptest.NewRequest` + `httptest.NewRecorder`, conferindo status e JSON | `internal/adapters/http/router_test.go` |
| **Componentes do frontend** | **Vitest 5.0.5** + **React Testing Library 16.3.3** + **jsdom 30.1.3** | Renderizar componentes num navegador simulado e procurá-los como o usuário vê (`getByRole`, `getByLabelText`) | `src/**/*.test.jsx` · `npm test` |
| **Interação do usuário** | **@testing-library/user-event 14.6.8** | Digitar, clicar e usar Tab como uma pessoa real | nos mesmos testes |
| **Asserções de tela** | **@testing-library/jest-dom 7.0.1** | Verificações como `toBeInTheDocument` e `toHaveTextContent` | carregado em `tests/setup.js` |
| **API simulada (integração do frontend)** | **MSW 3.0.3** (Mock Service Worker) | Responder às chamadas `/api/...` sem backend, inclusive com erros (`saldo_insuficiente` etc.); pedido não previsto faz o teste falhar | `tests/server.js`, `tests/app.test.jsx` |
| **Ponta a ponta (E2E)** | **Playwright 1.56.1** (Chromium) | Abrir o sistema real no navegador e clicar pelas telas; também gera as capturas de tela | `e2e/*.spec.js` · `npm run e2e` com o compose rodando |
| **Ambiente do E2E** | **Docker Compose** | Subir frontend (nginx) e backend (Go + SQLite) em 2 containers na rede `banco-net` | `docker compose up -d --build` |

Como as camadas se completam:

```text
            E2E (Playwright + Docker)          poucos testes, sistema inteiro
       Integração frontend (Vitest + MSW)      telas + API simulada
   Componentes (Vitest + Testing Library)      peças da interface
 BDD (godog) · API (httptest) · Contrato        comportamento do backend
       Unidade TDD/DDD (testing do Go)          muitos testes, regras puras
```

Os testes de baixo são rápidos e muitos; os de cima são lentos e poucos, mas provam que as peças
funcionam juntas.

## 1. Backend: regras novas de domínio

| Teste | Arquivo | O que garante | Por quê |
|---|---|---|---|
| `TestTransferirRecusaSemAlterarSaldos/origem_inativa` e `/destino_inativo` | `internal/domain/conta/transferencia_test.go` | Conta inativa não envia nem recebe; saldos não mudam | Regra nova, [ADR-011](decisoes.md#adr-011) |
| `TestTransferirRecusaMesmaConta` | `internal/domain/conta/transferencia_test.go` | Origem igual ao destino → `ErrMesmaConta`, saldo intacto | Regra nova, [ADR-018](decisoes.md#adr-018) |
| `TestTransferenciaMesmaContaNaoAlteraSaldo` | `internal/application/conta/servico_test.go` | A mesma regra, passando pelo caso de uso | ADR-018 |
| `TestNovoRecusaIdentificadorNomeEEmailInvalidos` | `internal/domain/cliente/cliente_security_test.go` | Recusa id ≤ 0, nome em branco e e-mail sem `@` | A API recebe dados de fora, coisa que o console não fazia |
| `TestSituacaoDaContaEIdempotente` | `internal/domain/conta/conta_test.go` | Desativar conta inativa e ativar de novo funcionam | Ativar/desativar conta agora aparecem na API (Q02) |
| `TestTransferirNaoPersisteQuandoSegundoAtualizarFalha` | `internal/application/conta/transferencia_uow_test.go` | Se gravar o destino falhar, a origem também não é gravada | Atomicidade com Unit of Work: o original era só memória |

## 2. Backend: persistência (adapters)

A troca de banco foi um requisito (SQLite atrás de um adapter). Estes testes garantem que os dois
adapters (memória e SQLite) se comportam igual e que nada é gravado pela metade.

| Teste | Arquivo | O que garante |
|---|---|---|
| `TestContratoMemory` e `TestContratoSQLite` | `tests/contract/` | **A mesma suíte** roda nos 2 adapters: adicionar, recusar id duplicado, buscar, atualizar e remover |
| `TestAbreBancoEMigraSchema` | `internal/adapters/sqlite/repositorios_test.go` | O banco abre e as tabelas são criadas |
| `TestContaRepositorioPersisteAtualizacao` | `internal/adapters/sqlite/conta_repositorio_test.go` | O novo saldo fica gravado no SQLite |
| `TestUnitOfWorkFazRollbackNoSQLite` | `internal/adapters/sqlite/unit_of_work_test.go` | Erro dentro da transação → rollback, saldo original mantido |
| `TestUnitOfWorkDescartaAlteracoesEmErro` | `internal/adapters/memory/unit_of_work_test.go` | O mesmo comportamento no adapter de memória |
| `TestBuscarRetornaCopiaQueExigeAtualizar` | `internal/adapters/memory/persistencia_test.go` | Mudar o objeto buscado não grava nada sem chamar `Atualizar`, igual ao SQLite |
| `TestAplicarEhIdempotenteMemory` e `TestAplicarEhIdempotenteSQLite` | `internal/seed/seed_test.go` | Os dados iniciais carregados 2 vezes não duplicam (o container reinicia sem duplicar) |

## 3. Backend: API HTTP

| Teste | Arquivo | O que garante |
|---|---|---|
| `TestHealth` | `internal/adapters/http/router_test.go` | `GET /api/health` → 200, usado pelo healthcheck do Docker |
| `TestRotasDeClientesEContas` | idem | Cada rota responde o status certo: 9 subtestes de escrita e situação, 4 `GET` de consulta e listagem (200) e 2 `DELETE` (204) |
| `TestMapearTodosOsErrosDoDominio` | idem | Cada erro do domínio vira o código e o status HTTP da [API](api.md) (13 erros) |
| `TestTransferenciaEMapeamentoDeErros` | idem | Transferir de conta inativa → 422 `conta_origem_inativa` |
| `TestTransferenciaMesmaContaRetorna422` | idem | Origem igual ao destino → 422 `mesma_conta` |
| `TestRouterRecusaIDsNaoPositivosECorpoGrande` | idem | Id 0 ou negativo na rota → 422; corpo acima de 1 MiB → 413 |

## 4. Backend: cenários BDD novos

Adicionados ao `features/transferir_valores.feature`, no mesmo estilo dos cenários originais:

| Cenário | O que verifica |
|---|---|
| Transferência com origem inativa | Rejeitada (ADR-011) |
| Transferência com destino inativa | Rejeitada (ADR-011) |
| Transferência para a mesma conta | Rejeitada e o saldo continua 100,00 (ADR-018) |

Com eles, o BDD tem 18 cenários e 85 passos.

## 5. Frontend (33 testes)

O original não tinha interface gráfica, então todos estes testes são novos. As chamadas à API são
simuladas com MSW, então os testes rodam sem backend.

### Componentes base — `src/components/base.test.jsx` (3) e `a11y.test.jsx` (3)

| Teste | O que garante |
|---|---|
| expõe situação com ícone e texto | Situação nunca é mostrada só por cor |
| alterna o tema | O botão troca entre claro e escuro |
| expõe a variante primária com token de contraste | O botão principal usa as cores do tema |
| renderiza Button, Field e Select com nomes | Todo controle tem nome acessível (rótulo) |
| prende foco no Dialog e devolve ao fechar | O teclado fica dentro do diálogo e volta ao botão de origem |
| StatusChip usa texto e Toast usa status | Leitores de tela anunciam as mensagens |

### Formatação — `src/lib/formato.test.js` (1)

| Teste | O que garante |
|---|---|
| formata valores em real brasileiro | Saldos aparecem como `R$ 1.234,56` |

### Clientes — `src/features/clientes/componentes.test.jsx` (10) → R01 a R07

| Teste | Requisito |
|---|---|
| oferece campos e ações acessíveis | todos |
| dispara ativar, desativar e remover | R04, R05, R07 |
| carrega a lista e executa ativar, desativar, situação e remoção | R04 a R07 |
| cadastra cliente e envia id, idade e idContaCorrente numéricos | R02 |
| mostra id_duplicado ao cadastrar cliente repetido | R02 |
| mostra idade_nao_permitida ao cadastrar menor de 18 | R02 + R03 |
| consulta cliente existente e exibe nome e situação | R01 |
| mostra cliente_nao_encontrado ao consultar id inexistente | R01 |
| informa idade 18 permitida | R03 |
| informa idade 66 não permitida | R03 |

### Contas e transferência — `src/features/contas/componentes.test.jsx` (8) → R08 a R12

| Teste | Requisito |
|---|---|
| oferece formulários e ações acessíveis | todos |
| usa somente a ação aplicável para ativar ou desativar | R10 |
| carrega a lista e executa ação da conta | R10, R11 |
| cadastra conta e envia id e saldo numéricos | R09 |
| mostra id_duplicado ao cadastrar conta repetida | R09 |
| consulta conta e exibe saldo e situação | R08 |
| mostra conta_nao_encontrada ao consultar id inexistente | R08 |
| transfere em formulário, revisão e recibo | R12 |

### Integração da aplicação — `tests/app.test.jsx` (8)

| Teste | O que garante |
|---|---|
| navega entre clientes, contas e transferência | O menu troca de tela |
| mostra a mensagem devolvida pela API ao falhar transferência | Erros da API aparecem para o usuário |
| exibe a mensagem de erro … da API (6 testes, um por erro) | `saldo_insuficiente`, `valor_invalido`, `conta_origem_nao_encontrada`, `conta_destino_nao_encontrada`, `conta_origem_inativa`, `conta_destino_inativa` |

## 6. Ponta a ponta — `e2e/fluxo-bancario.spec.js` (2)

Rodam no navegador (Playwright) contra o sistema completo no `docker compose`: frontend, nginx,
backend e SQLite.

| Teste | O que faz |
|---|---|
| cadastra conta, cliente e transfere valores pela interface | Cria uma conta e um cliente pela tela, transfere R$ 10 da conta 1 para a conta nova e confere que o recibo aparece. O id vem do relógio (900 a 1899), então execuções repetidas quase nunca colidem. |
| captura todas as telas nos temas claro e escuro | Gera as capturas de `e2e/screenshots/` em 1280 px e 390 px para a revisão visual |

## 7. Limites conhecidos

- Nas respostas simuladas pelo MSW, as mensagens de erro já vêm em português com acento. Por isso
  os testes não percebem que a tela mostra o texto do backend sem acento
  (ex.: "cliente nao encontrado").
- O E2E cobre o fluxo principal (cadastro e transferência), não as 12 operações, e não confere os
  saldos depois da transferência. As outras operações foram conferidas manualmente no navegador.

## 8. Como rodar

```bash
cd backend && go test ./...                      # tudo do backend, incluindo o BDD
cd frontend && npm test                          # 33 testes Vitest
docker compose up -d --build && cd frontend && npm run e2e   # Playwright
```
