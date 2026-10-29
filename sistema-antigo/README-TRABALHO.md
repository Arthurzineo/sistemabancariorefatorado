# Sistema Bancário — TDD, BDD e DDD

Atividade da disciplina de Teste de Software (ENS4003) sobre o Sistema Bancário em Java fornecido pelo professor.

## Tecnologias

- **Java** (código compilado com `release 8`, mesma versão configurada no Eclipse; testado com JDK 17)
- **Maven** via *Maven Wrapper* (`mvnw`, não precisa instalar o Maven)
- **JUnit 4.13.2** (a mesma família já declarada no `.classpath` do projeto)
- **Cucumber 7.20.1** (BDD, cenários em português)

Nada de Spring, banco de dados, Docker ou bibliotecas extras.

## Como executar

Na pasta deste arquivo (onde está o `pom.xml`):

```bash
./mvnw clean test          # Linux / macOS
mvnw.cmd clean test        # Windows
```

> **Primeira execução precisa de internet.** O `mvnw` baixa o Maven 3.9.9 e os plugins/dependências do Maven Central (JUnit, Cucumber). Sem rede, ou com `-o` e o cache `~/.m2` vazio, a execução falha antes de compilar (ex.: "maven-clean-plugin" não encontrado). Depois da primeira execução, `./mvnw -o test` funciona offline. É preciso um JDK 8 ou superior no `PATH` (testado com o 17).

Resultado esperado (execução real após colocar as 12 operações no menu: [`docs/evidencias/54-suite-final-apos-menu-completo.txt`](docs/evidencias/54-suite-final-apos-menu-completo.txt); build limpo com cache vazio após a 2ª auditoria: [`53-...`](docs/evidencias/53-build-independente-apos-2a-auditoria.txt)):

```
15 Scenarios (15 passed)
70 Steps (70 passed)
[INFO] Tests run: 55, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Teste manual original (sem framework), mantido sem alterações:

```bash
java -cp target/classes teste.TesteUnitarioManual    # 25 de 25 passam
```

### Menu do console

O sistema pode ser usado pelo console, com todas as 12 operações da atividade:

```bash
./mvnw -o compile                               # ou ./mvnw clean test
java -cp target/classes negocio.Main
```

```
--- Clientes ---
 1) Consultar cliente
 2) Cadastrar cliente
 3) Validar idade do cliente
 4) Ativar cliente
 5) Desativar cliente
 6) Verificar situacao do cliente
 7) Remover cliente
--- Contas correntes ---
 8) Consultar conta corrente
 9) Cadastrar conta corrente
10) Verificar situacao da conta corrente
11) Remover conta corrente
12) Transferir valores entre contas
----------------------
 0) Sair
```

Dados de exemplo ao iniciar: clientes 1 (Maria Silva) e 2 (Felipe Augusto), contas 1 e 2 com saldo 100,00. O `Main` só lê a entrada e mostra o resultado; toda regra (idade, id duplicado, saldo, valor positivo) continua no domínio. Entrada inválida (letra no lugar de número, linha vazia) pede o valor de novo em vez de encerrar o programa; valores aceitam vírgula ou ponto (`10,50`). Execução real passando por todas as opções, inclusive os casos de erro: [`docs/evidencias/55-menu-console-todas-as-opcoes.txt`](docs/evidencias/55-menu-console-todas-as-opcoes.txt).

> Antes da apresentação, rode `./mvnw clean test` **na máquina da apresentação**, a partir do ZIP final, para que a demonstração corresponda exatamente ao que foi entregue.

Rodar só uma parte: `./mvnw test -Dtest=TransferenciaTest`, `./mvnw test -Dtest=RunCucumberTest`, `./mvnw test -Dtest='ddd/*'`.

No Eclipse: *File → Import → Existing Maven Projects*. O `.classpath` antigo, que apontava para `D:/eclipse-workspace/junit-4.12.jar`, foi trocado pela configuração do plugin Maven (m2e). A versão original está em `docs/codigo-original/`.

## Estrutura

```
SistemaBancario/
├── pom.xml, mvnw, mvnw.cmd, .mvn/     build Maven (novo)
├── src/                                código de produção (estrutura ORIGINAL preservada)
│   ├── negocio/                        Cliente, ContaCorrente, SituacaoCliente, SituacaoConta,
│   │                                   SistemaBancario, repositórios...
│   └── teste/TesteUnitarioManual.java  teste manual original
├── test/
│   ├── java/
│   │   ├── tdd/                        testes JUnit dos requisitos TDD
│   │   ├── bdd/                        runner do Cucumber + step definitions
│   │   └── ddd/                        testes da modelagem de domínio
│   └── resources/features/             cenários BDD (.feature, em português)
└── docs/                               documentação da atividade + evidências reais
    ├── evidencias/                     saída de cada execução RED/GREEN/REFACTOR
    ├── codigo-original/                cópia do projeto recebido (não é compilada)
    └── diff-original-para-final.diff   todas as diferenças original → final
```

- **src**: código do sistema. Mantive `src/` em vez de `src/main/java` para não quebrar o projeto Eclipse do professor.
- **test**: testes automatizados novos (o `pom.xml` aponta para essas pastas).
- **features**: especificação do comportamento em Dado/Quando/Então, executada pelo Cucumber.
- **docs**: análise, TDD, BDD, DDD, integração e conclusão.

## TDD

| Requisito | Teste |
|---|---|
| 2. Cadastrar cliente | `test/java/tdd/CadastroClienteTest.java` |
| 3. Validar idade do cliente | `test/java/tdd/ValidacaoIdadeClienteTest.java` |
| 9. Cadastrar conta corrente | `test/java/tdd/CadastroContaCorrenteTest.java` |
| 12. Transferir valores entre contas | `test/java/tdd/TransferenciaTest.java` |
| 2 e 9 — unicidade do id (após auditoria) | `test/java/tdd/UnicidadeIdentificadorTest.java` |
| 9 e 12 — saldo sempre finito (após 2ª auditoria) | `test/java/tdd/SaldoFinitoTest.java` |

## BDD

| Requisito | Cenários |
|---|---|
| 1. Consultar cliente | `test/resources/features/consultar_cliente.feature` |
| 4. Ativar cliente | `test/resources/features/ativar_cliente.feature` |
| 5. Desativar cliente | `test/resources/features/desativar_cliente.feature` |
| 8. Consultar conta corrente | `test/resources/features/consultar_conta.feature` |

Steps: `test/java/bdd/ClienteSteps.java` e `ContaSteps.java`. Extra (doc 04): `transferir_valores.feature`.

## DDD

| Requisito | Modelagem | Testes |
|---|---|---|
| 6. Verificar situação do cliente | `SituacaoCliente`, `Cliente.ativar()/desativar()/getSituacao()`, `SistemaBancario.verificarSituacaoCliente` | `test/java/ddd/SituacaoClienteTest.java` |
| 7. Remover cliente | `SistemaBancario.removerCliente` → repositório | `test/java/ddd/RemocaoTest.java` |
| 10. Verificar situação da conta corrente | `SituacaoConta`, `ContaCorrente.ativar()/desativar()/getSituacao()`, `SistemaBancario.verificarSituacaoConta` | `test/java/ddd/SituacaoContaCorrenteTest.java` |
| 11. Remover conta corrente | `SistemaBancario.removerConta` → repositório | `test/java/ddd/RemocaoTest.java` |

## Documentação

- [`docs/00-analise-projeto.pdf`](docs/00-analise-projeto.pdf) — análise do projeto, problemas e suposições
- [`docs/01-tdd.pdf`](docs/01-tdd.pdf) — ciclos RED/GREEN/REFACTOR com saídas reais
- [`docs/02-bdd.pdf`](docs/02-bdd.pdf) — funcionalidades, histórias, cenários e testes
- [`docs/03-ddd.pdf`](docs/03-ddd.pdf) — modelagem de domínio dos requisitos 6, 7, 10 e 11
- [`docs/04-integracao-tdd-bdd-ddd.pdf`](docs/04-integracao-tdd-bdd-ddd.pdf) — requisito 12 pelas três abordagens
- [`docs/05-conclusao.pdf`](docs/05-conclusao.pdf) — conclusão
- [`docs/06-correcoes-pos-auditoria.pdf`](docs/06-correcoes-pos-auditoria.pdf) — achados da auditoria, correções e evidências
- [`docs/07-declaracao-uso-ia.pdf`](docs/07-declaracao-uso-ia.pdf) — **declaração de uso de IA**
- [`docs/08-fontes-consultadas.pdf`](docs/08-fontes-consultadas.pdf) — fontes efetivamente consultadas (com trechos) × leituras sugeridas
- [`docs/09-arquitetura-sistema.pdf`](docs/09-arquitetura-sistema.pdf) — arquitetura do sistema (camadas, diagramas, onde mora cada regra)
- [`docs/10-arquitetura-testes.pdf`](docs/10-arquitetura-testes.pdf) — arquitetura dos testes TDD/BDD/DDD e rastreabilidade dos 12 requisitos
- [`docs/11-roteiro-apresentacao.pdf`](docs/11-roteiro-apresentacao.pdf) — roteiro para a apresentação de 01/10
- [`docs/evidencias/`](docs/evidencias/) — logs reais de cada execução, em ordem cronológica
- [`docs/codigo-original/`](docs/codigo-original/) e [`docs/diff-original-para-final.diff`](docs/diff-original-para-final.diff) — versão inicial verificável

## Uso de IA

Foram usados o **Claude Code** (Anthropic) como apoio na documentação e o **Codex** (OpenAI) como apoio no código. Finalidades e forma de verificação estão em [`docs/07-declaracao-uso-ia.pdf`](docs/07-declaracao-uso-ia.pdf); as fontes, em [`docs/08-fontes-consultadas.pdf`](docs/08-fontes-consultadas.pdf).

## Limitações conhecidas

- Valores monetários usam `double`, como no original. O saldo de uma conta é **sempre finito**: o construtor e o `setSaldo` recusam `Infinity`/`NaN`, e a transferência recusa valor `NaN`/infinito e crédito que estouraria o destino. O `double` continua sem exatidão decimal (ex.: `0.1 + 0.2`); `BigDecimal` fica como recomendação (docs 06, seções 1 e 9).
- `RepositorioBase.estaAtivo(id)` não distingue inexistente de inativo (mantido por compatibilidade). Use `SistemaBancario.verificarSituacao*`.
