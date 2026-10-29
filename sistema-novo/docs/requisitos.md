# Requisitos — Sistema Bancário por IA

Fonte: projeto original [`sistema-antigo/`](../../sistema-antigo) (Java 8, JUnit 4, Cucumber 7).
Analisado em 2026-10-22. As regras abaixo foram extraídas do **código de domínio** e dos **testes**
do original, e devem ser preservadas na migração (paridade de comportamento).

## 1. Objetivo da atividade

Refatorar o sistema bancário de console para uma aplicação **cliente-servidor**:

- **Backend** em Go, arquitetura hexagonal (ports & adapters) + MVC, com design patterns.
- **Frontend** simples em React (Vite) que permita usar as 12 operações.
- **Persistência** em SQLite atrás de um adapter (DAO), trocável por outro banco.
- **Testes** guiados por TDD, BDD e DDD no backend, e testes de frontend.
- **Docker**: frontend e backend em 2 containers separados, ligados por uma rede Docker.

## 2. Requisitos funcionais (12 operações do original)

| # | Operação | Técnica no original | Regra preservada |
|---|---|---|---|
| R01 | Consultar cliente | BDD | Retorna o cliente pelo id; inexistente → "cliente não encontrado". |
| R02 | Cadastrar cliente | TDD | Id único; idade válida (R03); recusa id duplicado. |
| R03 | Validar idade do cliente | TDD | Idade permitida: **18 ≤ idade ≤ 65** (limites inclusivos), no cadastro e na alteração. Também existe como consulta isolada ("idade X permitida?"). |
| R04 | Ativar cliente | BDD | Ativar cliente inativo ou já ativo → sucesso (idempotente); inexistente → rejeita. |
| R05 | Desativar cliente | BDD | Desativar ativo ou já inativo → sucesso (idempotente); inexistente → rejeita. |
| R06 | Verificar situação do cliente | DDD | Situação é `Ativo` / `Inativo`; inexistente é **diferente** de inativo. |
| R07 | Remover cliente | DDD | Remove pelo id; inexistente → rejeita; **não remove a conta associada**. |
| R08 | Consultar conta corrente | BDD | Retorna id, saldo e situação (`Ativa`/`Inativa`); inexistente → "conta não encontrada". |
| R09 | Cadastrar conta corrente | TDD | Número (id) único; saldo inicial precisa ser finito. |
| R10 | Verificar situação da conta | DDD | Situação é `Ativa` / `Inativa`; inexistente é diferente de inativa. |
| R11 | Remover conta corrente | DDD | Remove pelo id; inexistente → rejeita. |
| R12 | Transferir valores entre contas | TDD + BDD + DDD | Ver §3. |

## 3. Regras de domínio detalhadas

### Cliente
- Campos: `id` (imutável), `nome`, `idade`, `email`, `idContaCorrente`, `situacao`.
- `IDADE_MINIMA = 18`, `IDADE_MAXIMA = 65`.
- Mensagem: "A idade do cliente precisa estar entre 18 e 65 anos."
- Criar ou alterar a idade fora da faixa → erro de domínio.

### Conta corrente
- Campos: `id` (imutável), `saldo` (`float64`, ver [ADR-003](decisoes.md#adr-003)), `situacao`.
- Saldo **sempre finito**: criar ou definir saldo `NaN`/`±Inf` → erro.

### Transferência (R12)
A transferência só acontece se **todas** as condições valerem; senão nada muda:
1. a conta de origem existe;
2. a conta de destino existe (não nula);
3. o valor é **> 0** (zero, negativo e `NaN` são recusados);
4. o saldo da origem é **≥ valor**;
5. o saldo do destino continua finito após o crédito;
6. a conta de origem está **Ativa**;
7. a conta de destino está **Ativa**;
8. a origem é **diferente** do destino ([ADR-018](decisoes.md#adr-018)).

> As condições 6 e 7 são **novas** (decisão do usuário, 2026-10-22, [ADR-011](decisoes.md#adr-011)): o original permitia transferir com conta inativa.

É atômica: débito e crédito acontecem juntos ou nenhum acontece (no SQLite, em uma transação).
O original no console já distinguia o motivo (origem inexistente, destino inexistente, valor
inválido, saldo insuficiente). A API nova retorna esse motivo como **erro tipado** em vez de `false`.

### Repositório
- Id duplicado na adição → recusa.
- Carga inicial com ids duplicados → erro.
- A listagem não pode ser alterada por fora (no Go, retornar cópias).

### Dados iniciais (seed)
- Contas 1 e 2, saldo 100,00, ativas.
- Cliente 1: "Maria Silva", 31, mariasilva@gmail.com, conta 1, ativo.
- Cliente 2: "Felipe Augusto", 34, felipeaugusto@gmail.com, conta 2, ativo.

## 4. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | Backend em Go, arquitetura hexagonal + MVC, clean code e clean architecture. |
| RNF02 | Arquivos pequenos e coesos (um conceito por arquivo; nada de arquivos gigantes). |
| RNF03 | SQLite atrás de uma porta de repositório (DAO/adapter); trocar de banco não pode afetar o domínio. |
| RNF04 | Desenvolvimento por TDD (RED → GREEN → REFACTOR), BDD (Gherkin em português) e DDD. |
| RNF05 | Testes de frontend (componentes e integração com a API mockada). |
| RNF06 | Frontend e backend em containers separados, ligados por uma rede Docker. |
| RNF07 | Evidência de TDD pelo histórico git: um commit por etapa RED/GREEN/REFACTOR. |
| RNF08 | O README explica como rodar tudo com um comando (`docker compose up`). |

## 5. Pontos em aberto (decidir antes da fase indicada)

| ID | Questão | Proposta padrão | Fase |
|---|---|---|---|
| Q01 | O cadastro de cliente deve validar se `idContaCorrente` existe? O original **não** valida. | **Decidido (Chief):** manter a paridade (não validar). | P002 |
| Q02 | Ativar/desativar **conta** existe no domínio, mas não no menu do original. Expor na API/UI? | **Decidido (Chief):** Expor na API e na UI (necessário para testar R10 pela interface). | P004 |
| Q03 | Listar todos os clientes/contas (só existe no repositório do original). | **Decidido (Chief):** Expor `GET` de listagem para a UI. | P004 |
| Q04 | Alterar dados do cliente (nome/email/idade) — existe no domínio, não no menu. | **Decidido (Chief):** Fora de escopo; só a alteração de idade aparece nos testes do domínio. | P002 |
| Q05 | Autenticação/usuários. | **Decidido (Chief):** Fora de escopo (o original não tem). | — |

## 6. Rastreabilidade com os testes do original e cobertura de testes

| Requisito | Testes originais | Testes reais em Go (Backend P002–P004) | Testes no Frontend (React/MSW P005/P008) | Testes E2E (Playwright P006/P008) | Status |
|---|---|---|---|---|---|
| R01 | `consultar_cliente.feature` (2 cenários) | `application/cliente/casos_de_uso_test.go`, `features/consultar_cliente.feature`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (consulta existente e 404) | — | Concluído |
| R02 | `CadastroClienteTest`, `UnicidadeIdentificadorTest` | `application/cliente/casos_de_uso_test.go`, `tests/contract/contratos_test.go`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (cadastro numérico e id duplicado) | `e2e/fluxo-bancario.spec.js` (cadastro de cliente na interface) | Concluído |
| R03 | `ValidacaoIdadeClienteTest` (7 testes, limites 18/65, alteração) | `domain/cliente/cliente_test.go`, `application/cliente/operacoes_test.go`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (menor 18, limite 18 OK, 66 rejeitado) | — | Concluído |
| R04 | `ativar_cliente.feature` (3 cenários) | `domain/cliente/cliente_test.go`, `application/cliente/operacoes_test.go`, `features/ativar_cliente.feature`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de ativar na lista) | — | Concluído |
| R05 | `desativar_cliente.feature` (3 cenários) | `domain/cliente/cliente_test.go`, `application/cliente/operacoes_test.go`, `features/desativar_cliente.feature`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de desativar na lista) | — | Concluído |
| R06 | `SituacaoClienteTest` | `application/cliente/operacoes_test.go`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (exibição de Ativo/Inativo) | — | Concluído |
| R07 | `RemocaoTest` (cliente) | `application/cliente/casos_de_uso_test.go`, `adapters/http/router_test.go` | `clientes/componentes.test.jsx` (ação de remoção na lista com dialog de confirmação) | — | Concluído |
| R08 | `consultar_conta.feature` (3 cenários) | `application/conta/servico_test.go`, `features/consultar_conta.feature`, `adapters/http/router_test.go` | `contas/componentes.test.jsx` (consulta existente e 404) | — | Concluído |
| R09 | `CadastroContaCorrenteTest`, `UnicidadeIdentificadorTest`, `SaldoFinitoTest` | `domain/conta/conta_test.go`, `application/conta/servico_test.go`, `tests/contract/contratos_test.go`, `adapters/http/router_test.go` | `contas/componentes.test.jsx` (cadastro numérico e id duplicado) | `e2e/fluxo-bancario.spec.js` (cadastro de conta na interface) | Concluído |
| R10 | `SituacaoContaCorrenteTest` | `domain/conta/conta_test.go`, `application/conta/operacoes_test.go`, `adapters/http/router_test.go` | `contas/componentes.test.jsx` (exibição e consulta de situação Ativa/Inativa) | — | Concluído |
| R11 | `RemocaoTest` (conta) | `application/conta/operacoes_test.go`, `adapters/http/router_test.go` | `contas/componentes.test.jsx` (ação de remoção com dialog de confirmação) | — | Concluído |
| R12 | `TransferenciaTest` (7 testes), `transferir_valores.feature` (4 cenários) | `domain/conta/transferencia_test.go` (inclui mesma conta — ADR-018), `exploratorio_test.go`, `application/conta/servico_test.go`, `transferencia_uow_test.go`, `features/transferir_valores.feature` (7 cenários), `adapters/http/router_test.go` (422 `mesma_conta`) | `contas/componentes.test.jsx` (transferência em 3 passos: form, revisão e recibo) + `tests/app.test.jsx` (erros tipados) | `e2e/fluxo-bancario.spec.js` (transferência entre contas e validação de saldos) | Concluído |

Totais do original: 40 testes JUnit (métodos `@Test`) e 15 cenários BDD.
Nas fases **P002**, **P003**, **P004**, **P005**, **P006**, **P007** e **P008**, todos os requisitos originais e as extensões de arquitetura e design foram validados:
- **Backend:** 31 funções/suítes de teste automatizadas (unidade, persistência SQLite com WAL e memória, contratos e HTTP com handlers desacoplados e segurança) + 18 cenários BDD godog (85 steps).
- **Frontend (P008 Redesign):** 33 testes automatizados (Vitest + React Testing Library + MSW) em 6 suítes cobrindo componentes base (`base.test.jsx`, `a11y.test.jsx`), formatação BRL (`formato.test.js`), clientes (`componentes.test.jsx`, 10 testes), contas e fluxo de transferência em 3 passos (`componentes.test.jsx`, 8 testes) e integração com navegação e erros tipados (`tests/app.test.jsx`, 8 testes).
- **E2E Ponta a Ponta:** Fluxo bancário completo automatizado em Playwright (`frontend/e2e/fluxo-bancario.spec.js`) executando contra a stack conteinerizada do Docker Compose de forma repetível e idempotente, gerando capturas de tela nos temas claro e escuro em resoluções desktop (1280px) e mobile (390px).
