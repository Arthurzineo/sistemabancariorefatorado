# Testes migrados de Java para Go

Este documento mostra, teste por teste, para onde foi cada teste do sistema original. Os testes
criados do zero estão em [testes-novos.md](testes-novos.md).

| | Original (Java 8) | Novo (Go 1.25) |
|---|---|---|
| Testes de unidade | JUnit 4: 40 métodos `@Test` em 9 classes | `go test`: funções `TestXxx`, várias com tabela de casos |
| BDD | Cucumber 7: 5 arquivos `.feature`, 15 cenários | godog: os mesmos 5 arquivos `.feature` em português, os mesmos 15 cenários |
| Pastas | `test/java/tdd`, `test/java/ddd`, `test/java/bdd` | `internal/domain`, `internal/application`, `tests/contract`, `features` + `tests/bdd` |

No original os testes ficavam separados por técnica (`tdd/`, `ddd/`, `bdd/`). No Go eles ficam
junto da camada que testam: regra pura em `domain`, orquestração em `application`, repositório em
`tests/contract`. Por isso um teste Java pode ter virado parte de um teste Go maior.

## Ferramentas: antes e depois

| Técnica | Original (Java) | Novo (Go) | O que mudou na prática |
|---|---|---|---|
| **TDD** (unidade) | **JUnit 4.13.2**: classe com métodos `@Test`, `@Before` para preparar e `assertEquals`/`assertTrue` | Pacote **`testing`** da biblioteca padrão do Go: função `func TestXxx(t *testing.T)`; falha com `t.Fatal`/`t.Fatalf` | Não precisa de biblioteca externa. Vários casos parecidos viram **uma tabela de casos** com `t.Run` (ex.: `TestTransferirRecusaSemAlterarSaldos`) |
| Ciclo TDD | Não registrado | Commits `test(...)` (RED) → `feat(...)` (GREEN) → `refactor(...)` no git | A prova do TDD é o histórico git ([ADR-008](decisoes.md#adr-008)) |
| **DDD** (modelagem) | JUnit 4, em `test/java/ddd` | `testing`, ao lado do código em `internal/domain` e `internal/application` | Os erros do domínio são valores (`ErrContaNaoEncontrada`) e o teste compara com `errors.Is` em vez de esperar `false` ou exceção |
| **BDD** (aceitação) | **Cucumber 7.20.1** (`cucumber-java` + `cucumber-junit`); steps em `ClienteSteps`/`ContaSteps`; runner `RunCucumberTest` | **godog v0.15.1** (o Cucumber oficial para Go); steps e runner em `tests/bdd/bdd_test.go` | Os `.feature` são os mesmos, em Gherkin português (`# language: pt`). Cada step é ligado por expressão regular com `ctx.Step(...)` |
| Repositório | JUnit sobre o repositório em memória | `testing` + **suíte de contrato** (`tests/contract`) que roda no adapter de memória e no SQLite (`modernc.org/sqlite` v1.58.0) | O mesmo teste prova que trocar de banco não muda o comportamento |
| Como rodar | `mvnw test` (Maven 3, Java 8, Surefire) | `go test ./...` | Um comando roda unidade, contrato, HTTP e BDD |

Os testes Go usam o adapter de **memória** como dublê do banco (sem mocks gerados): é rápido,
determinístico e passa pela mesma suíte de contrato que o SQLite.

**Legenda de situação**
- **Migrado**: existe um teste Go que verifica a mesma coisa.
- **Coberto pelo BDD**: a verificação é feita por um cenário godog, não por um teste de unidade.
- **Parcial**: o teste Go cobre só parte do original.
- **Não migrado**: não há verificação equivalente (ver §4).

Os caminhos Go abaixo são relativos a `backend/`.

## 1. Testes TDD (`test/java/tdd`)

### CadastroClienteTest → R02

| Teste original | Teste Go | Situação |
|---|---|---|
| `deveCadastrarClienteValido` | `internal/application/cliente/casos_de_uso_test.go` · `TestCadastrarClienteRecusaIdentificadorDuplicado` (primeiro cadastro) | Migrado |
| `naoDeveCadastrarClienteComIdentificadorDuplicado` | mesmo teste (segundo cadastro → `ErrIDDuplicado`) | Migrado |

### CadastroContaCorrenteTest → R09

| Teste original | Teste Go | Situação |
|---|---|---|
| `deveCadastrarContaCorrenteValida` | `internal/application/conta/servico_test.go` · `TestCadastroContaETransferencia` | Migrado |
| `naoDeveCadastrarNumeroDeContaDuplicado` | mesmo teste (cadastro repetido → `ErrIDDuplicado`) | Migrado |

### ValidacaoIdadeClienteTest → R03

| Teste original | Teste Go | Situação |
|---|---|---|
| `deveAceitarIdadeExatamenteNoLimiteInferior` | `internal/domain/cliente/cliente_test.go` · `TestNovoValidaLimitesDeIdade` (18) | Migrado |
| `deveAceitarIdadeExatamenteNoLimiteSuperior` | mesmo teste (65) | Migrado |
| `naoDeveCadastrarClienteComIdadeAbaixoDoLimite` | mesmo teste (17) | Migrado |
| `naoDeveCadastrarClienteComIdadeAcimaDoLimite` | mesmo teste (66) | Migrado |
| `naoDevePermitirAlterarIdadeParaForaDaFaixa` | `TestDefinirIdadeMantemEstadoQuandoInvalida` (também confere que a idade antiga é mantida) | Migrado |
| `devePermitirAlterarIdadeDentroDaFaixa` | — | **Não migrado** |
| `idadePermitidaDeveSeguirOsMesmosLimitesDoCadastro` | `TestIdadePermitidaSegueMesmosLimites` (domínio) e `internal/application/cliente/operacoes_test.go` · `TestValidarIdade` | Migrado |

### SaldoFinitoTest → R09

| Teste original | Teste Go | Situação |
|---|---|---|
| `naoDeveCriarContaComSaldoInfinito` | `internal/domain/conta/conta_test.go` · `TestNovaRecusaSaldoNaoFinito` (+Inf e −Inf) | Migrado |
| `naoDeveCriarContaComSaldoNaoNumerico` | mesmo teste (`NaN`) | Migrado |
| `naoDevePermitirDefinirSaldoNaoFinito` | `TestDefinirSaldoMantemEstadoQuandoInvalido` | Migrado |

### UnicidadeIdentificadorTest → repositório

| Teste original | Teste Go | Situação |
|---|---|---|
| `naoDeveAdicionarDiretamenteNoRepositorioComIdDuplicado` | `tests/contract` · `TestContratoMemory` e `TestContratoSQLite` ("id duplicado aceito") | Migrado, agora nos 2 adapters |
| `naoDevePermitirAlterarAListaDoRepositorioPorFora` | `internal/adapters/memory/repositorios_test.go` · `TestListarRetornaCopiaDoSlice` | Migrado |
| `alterarAListaOriginalNaoDeveAfetarORepositorio` | — | **Não migrado** (ver §4) |
| `naoDeveCriarRepositorioComIdsDuplicados` | — | **Não migrado** (ver §4) |

### TransferenciaTest → R12

| Teste original | Teste Go | Situação |
|---|---|---|
| `deveTransferirQuandoExisteSaldoSuficiente` | `internal/domain/conta/transferencia_test.go` · `TestTransferirMoveSaldoEntreContasAtivas` | Migrado |
| `naoDeveTransferirQuandoSaldoForInsuficiente` | `TestTransferirRecusaSemAlterarSaldos/saldo_insuficiente` | Migrado |
| `naoDeveTransferirValorNegativo` | `transferir_valores.feature` · Esquema "valor inválido" (−50,00) | Coberto pelo BDD |
| `naoDeveTransferirValorZero` | mesmo Esquema (0,00) | Coberto pelo BDD |
| `naoDeveTransferirParaDestinoNulo` | `TestTransferirRecusaSemAlterarSaldos/destino_ausente` | Migrado |
| `naoDeveTransferirQuandoSaldoDoDestinoDeixariaDeSerFinito` | `internal/domain/conta/exploratorio_test.go` · `TestTransferirMaxFloat64NaoGeraInfinito` | Migrado |
| `naoDeveTransferirValorNaoNumerico` | `TestTransferirRecusaSemAlterarSaldos/valor_invalido` (`NaN`) | Migrado |

O método auxiliar `assertSaldosInalterados` do original virou parte de cada caso da tabela Go: todo
caso de recusa confere que os dois saldos continuam iguais.

## 2. Testes DDD (`test/java/ddd`)

### SituacaoClienteTest → R04, R05, R06

| Teste original | Teste Go | Situação |
|---|---|---|
| `clienteCriadoAtivoDeveEstarNaSituacaoAtivo` | `ativar_cliente.feature` · "Ativar cliente que já está ativo" | Coberto pelo BDD |
| `clienteDesativadoDeveEstarNaSituacaoInativo` | `desativar_cliente.feature` · "Desativar cliente ativo" | Coberto pelo BDD |
| `clienteReativadoDeveVoltarParaSituacaoAtivo` | `ativar_cliente.feature` · "Ativar cliente inativo" | Coberto pelo BDD |
| `deveVerificarSituacaoDeClienteCadastrado` | `internal/application/cliente/operacoes_test.go` · `TestSituacaoDistingueClienteInexistenteDeInativo` | Migrado |
| `naoDeveConfundirClienteInexistenteComClienteInativo` | mesmo teste (id 99 → `ErrClienteNaoEncontrado`) | Migrado |

### SituacaoContaCorrenteTest → R10

| Teste original | Teste Go | Situação |
|---|---|---|
| `contaCriadaAtivaDeveEstarNaSituacaoAtiva` | `consultar_conta.feature` · "Consultar conta corrente ativa" | Coberto pelo BDD |
| `contaCriadaInativaDeveEstarNaSituacaoInativa` | `internal/domain/conta/conta_test.go` · `TestSituacaoDaContaEIdempotente` (cria inativa, mas só confere a situação depois de chamar `Desativar`) | Parcial |
| `contaDesativadaDeveEstarNaSituacaoInativa` | `internal/application/conta/operacoes_test.go` · `TestSituacaoEDesativacaoDaConta` | Migrado |
| `deveVerificarSituacaoDeContaCadastrada` | mesmo teste | Migrado |
| `naoDeveConfundirContaInexistenteComContaInativa` | mesmo teste (id 99 → `ErrContaNaoEncontrada`) | Migrado |

### RemocaoTest → R07, R11

| Teste original | Teste Go | Situação |
|---|---|---|
| `deveRemoverClienteCadastrado` | `internal/application/cliente/casos_de_uso_test.go` · `TestRemoverClienteNaoRemoveContaAssociada` e contrato do repositório | Migrado |
| `naoDeveRemoverClienteInexistente` | — | **Não migrado** |
| `removerClienteNaoRemoveAContaCorrenteAssociada` | `TestRemoverClienteNaoRemoveContaAssociada` | Migrado |
| `deveRemoverContaCorrenteCadastrada` | `tests/contract` (remoção nos 2 adapters) e `TestRotasDeClientesEContas` (`DELETE` → 204) | Migrado |
| `naoDeveRemoverContaCorrenteInexistente` | `internal/application/conta/operacoes_test.go` · `TestRemoverContaInexistenteRetornaErro` | Migrado |

## 3. Testes BDD (`test/resources/features` → `backend/features`)

Os 5 arquivos foram copiados com `# language: pt` e o mesmo texto. Os passos (steps) foram
reescritos em Go com godog em `tests/bdd/bdd_test.go` e chamam a camada de aplicação, como os
`ClienteSteps` e `ContaSteps` do original faziam com o sistema Java.

| Arquivo | Cenários originais | Situação |
|---|---|---|
| `consultar_cliente.feature` | Consultar cliente existente; Consultar cliente inexistente | Migrados (2) |
| `ativar_cliente.feature` | Ativar cliente inativo; Ativar cliente que já está ativo; Tentar ativar cliente inexistente | Migrados (3) |
| `desativar_cliente.feature` | Desativar cliente ativo; Desativar cliente que já está inativo; Tentar desativar cliente inexistente | Migrados (3) |
| `consultar_conta.feature` | Consultar conta corrente ativa; inativa; inexistente | Migrados (3) |
| `transferir_valores.feature` | Transferência com sucesso; sem saldo suficiente; Esquema "valor inválido" com 0,00 e −50,00 | Migrados (4) |
| **Total** | **15** | **15 migrados** |

O mesmo arquivo `transferir_valores.feature` ganhou 3 cenários novos, listados em
[testes-novos.md](testes-novos.md).

O runner `RunCucumberTest.java` virou `TestFeatures` em `tests/bdd/bdd_test.go`.

## 4. O que não foi migrado

| Original | Por quê |
|---|---|
| `devePermitirAlterarIdadeDentroDaFaixa` | Falta de cobertura. A regra existe (`Cliente.DefinirIdade`), mas nenhum teste Go confere a alteração válida. |
| `naoDeveRemoverClienteInexistente` | Falta de cobertura. O código devolve `ErrClienteNaoEncontrado`, mas só a remoção de **conta** inexistente tem teste. |
| `alterarAListaOriginalNaoDeveAfetarORepositorio` e `naoDeveCriarRepositorioComIdsDuplicados` | Sem equivalente direto. No Java o repositório podia ser criado a partir de uma lista. No Go ele sempre começa vazio, e a carga inicial é feita pelo `seed`, que é idempotente e testado em `internal/seed/seed_test.go`. |
| `src/teste/TesteUnitarioManual.java` | Decisão de projeto: era um roteiro manual de console, substituído pelos testes automatizados. |

## 5. Resumo

| Origem | Total | Migrado | Coberto pelo BDD | Parcial | Não migrado |
|---|---|---|---|---|---|
| JUnit (`@Test`) | 40 | 29 | 6 | 1 | 4 (2 sem equivalente direto) |
| Cenários BDD | 15 | 15 | — | — | 0 |

Para rodar:

```bash
cd backend && go test ./...              # unidade, contrato, HTTP e BDD
cd backend && go test ./tests/bdd/ -v    # só o BDD, com o nome de cada cenário
```
