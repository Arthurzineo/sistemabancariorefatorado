# Arquitetura

## 1. Visão geral

```text
 Navegador
    │  http://localhost:3000
    ▼
┌──────────────── rede docker: banco-net ────────────────┐
│                                                          │
│  [frontend]  nginx                                       │
│   • serve o build do React (Vite)                        │
│   • proxy /api/*  ───────────►  [backend]  Go :8080      │
│                                   • API REST (JSON)      │
│                                   • SQLite em volume     │
│                                     /data/banco.db       │
└──────────────────────────────────────────────────────────┘
```

Só o frontend publica uma porta no host. O backend fica acessível apenas dentro da rede
`banco-net` (pelo nome `backend`). Ver [infra-docker.md](infra-docker.md).

## 2. Backend — hexagonal + MVC

Leitura MVC dentro da hexagonal:

| MVC | Onde fica |
|---|---|
| **Model** | `internal/domain` — entidades, value objects e regras (sem dependências externas). |
| **Controller** | `internal/adapters/http` — handlers que traduzem HTTP ↔ casos de uso. |
| **View** | Frontend React (consome o JSON) + DTOs de resposta em `adapters/http/dto`. |

Regra de dependência (clean architecture): **as setas apontam para dentro**.

```text
adapters/http ──► application ──► domain
adapters/sqlite ─► application/ports ◄─ (implementa)
cmd/api (composition root) conhece todos e os conecta
```

O `domain` não importa nada do projeto. A `application` só importa o `domain`.
Os adapters importam a `application` (portas) e o `domain`.

### Estrutura de pastas (adotada — ver ADR-016, ADR-018 e ADR-019)

Todo o código fica em `sistemabancariorefatorado/` (repositório git próprio); os caminhos abaixo são relativos a ela.

```text
backend/
├── cmd/api/main.go                 # composition root: lê config, cria adapters, injeta, sobe HTTP com timeouts
├── internal/
│   ├── domain/
│   │   ├── cliente/
│   │   │   ├── cliente.go          # entidade Cliente, validação de nome/email/idade (18..65), situação e erros
│   │   │   └── cliente_test.go
│   │   └── conta/
│   │       ├── conta.go            # entidade ContaCorrente, saldo finito e situação
│   │       ├── conta_test.go
│   │       ├── transferencia.go    # serviço de domínio: regras do R12 (8 condições atômicas, incluindo mesma conta — ADR-018)
│   │       └── transferencia_test.go
│   ├── application/
│   │   ├── ports/
│   │   │   └── repositorios.go     # interfaces ClienteRepository, ContaRepository e UnitOfWork
│   │   ├── cliente/
│   │   │   ├── servico.go          # casos de uso de cliente (consultar, cadastrar, validar idade, ativar, desativar, situação, remover)
│   │   │   ├── casos_de_uso_test.go
│   │   │   └── operacoes_test.go
│   │   └── conta/
│   │       ├── servico.go          # casos de uso de conta (consultar, cadastrar, transferir com UoW, ativar, desativar, situação, remover)
│   │       ├── servico_test.go
│   │       └── operacoes_test.go
│   ├── adapters/
│   │   ├── http/
│   │   │   ├── router.go           # registro de rotas no ServeMux padrão do Go 1.22+
│   │   │   ├── cliente_handler.go  # endpoints de clientes (/api/clientes, ativação, desativação, remoção)
│   │   │   ├── conta_handler.go    # endpoints de contas (/api/contas, ativação, desativação, remoção)
│   │   │   ├── transferencia_handler.go # endpoint de transferência (/api/transferencias) com Unit of Work
│   │   │   ├── erros.go            # mapeamento erro de domínio → status HTTP e payload JSON padronizado
│   │   │   ├── json.go             # decodificação segura (http.MaxBytesReader 1 MiB → 413, JSON estrito, validação id > 0)
│   │   │   └── router_test.go
│   │   ├── sqlite/
│   │   │   ├── banco.go            # abertura de conexão com modo WAL (_pragma=journal_mode(WAL)) e migrações
│   │   │   ├── cliente_repositorio.go
│   │   │   ├── conta_repositorio.go
│   │   │   └── unit_of_work.go     # controle transacional BEGIN / COMMIT / ROLLBACK
│   │   └── memory/                 # repositório em memória (testes e modo dev)
│   │       ├── repositorios.go     # implementação em memória com cópias defensivas
│   │       ├── repositorios_test.go
│   │       └── persistencia_test.go
│   ├── seed/seed.go                # dados iniciais idempotentes
│   └── config/config.go
├── features/                       # 18 cenários .feature em português (godog, P004 e P007)
├── tests/
│   ├── bdd/                        # step definitions (85 steps godog)
│   └── contract/                   # suíte de conformidade rodando contra memory e sqlite
├── go.mod
├── Makefile
└── Dockerfile
```

Convenções: casos de uso agrupados em `servico.go` por contexto (cliente, conta) mantendo arquivos pequenos (≲150 linhas) e coesos ([ADR-016](decisoes.md#adr-016)); funções curtas; teste `_test.go` ao lado do arquivo testado (unidade) e em `tests/` para BDD e contrato.

### Design patterns aplicados

| Pattern | Onde | Por quê |
|---|---|---|
| **Ports & Adapters** (Hexagonal) | `application/ports` + `adapters/*` | Isola o domínio de HTTP e banco. |
| **Repository / DAO** | `ports/repositorios.go`, `sqlite/*_dao.go`, `memory/` | Troca fácil de banco (requisito RNF03). |
| **Adapter** | `adapters/sqlite`, `adapters/http` | Traduz tecnologias externas para as portas. |
| **Factory** | `cliente.Novo(...)`, `conta.Nova(...)`, `seed` | Garante que nenhuma entidade nasce inválida. |
| **Domain Service** | `conta/transferencia.go` | A regra envolve duas contas, então não pertence a uma só. |
| **Unit of Work** | `ports/unit_of_work.go`, `sqlite/unit_of_work.go` | Torna a transferência atômica. |
| **Dependency Injection** (manual) | `cmd/api/main.go` | Composition root; sem frameworks. |
| **Application Service** (casos de uso) | `application/*/servico.go` | Agrupa os casos de uso do contexto em structs coesas ([ADR-016](decisoes.md#adr-016)). |

Fora de escopo: patterns sem um problema concreto (Singleton, Observer etc.).

### Erros

O domínio expõe erros sentinela (`errors.Is`). O adapter HTTP mapeia esses erros para status HTTP
(tabela em [api.md](api.md)). Nada de `panic` para fluxo de negócio.

## 3. Frontend

```text
frontend/
├── index.html
├── vite.config.js                 # proxy /api → backend em dev
├── nginx.conf                     # proxy /api → backend em produção
├── package.json                   # versões exatas fixadas (ADR-017)
├── package-lock.json
├── src/
│   ├── main.jsx
│   ├── App.jsx                    # navegação simples em abas (Clientes, Contas)
│   ├── api/                       # cliente HTTP (fetch), um arquivo por recurso
│   │   ├── http.js
│   │   ├── clientes.js
│   │   └── contas.js
│   ├── components/                # UI genérica
│   │   └── Mensagem.jsx           # feedback de alertas e erros (role="alert")
│   ├── hooks/
│   │   └── useMensagem.js         # hook isolado para gestão de mensagens (ADR-017)
│   ├── features/
│   │   ├── clientes/              # componentes por responsabilidade (ADR-017)
│   │   │   ├── Clientes.jsx       # container da aba de clientes
│   │   │   ├── CadastroCliente.jsx
│   │   │   ├── ConsultaCliente.jsx
│   │   │   ├── ValidacaoIdade.jsx
│   │   │   ├── ListaClientes.jsx
│   │   │   ├── AcoesCliente.jsx   # ativar, desativar, situação e remover
│   │   │   └── componentes.test.jsx
│   │   └── contas/                # componentes por responsabilidade (ADR-017)
│   │       ├── Contas.jsx         # container da aba de contas
│   │       ├── CadastroConta.jsx
│   │       ├── ConsultaConta.jsx
│   │       ├── ListaContas.jsx
│   │       ├── Transferencia.jsx  # formulário de transferência com 6 erros tipados
│   │       └── componentes.test.jsx
│   └── styles/
│       └── app.css
├── tests/
│   ├── app.test.jsx               # testes de integração e erros de transferência
│   ├── server.js                  # handlers e setup do MSW
│   └── setup.js                   # cleanup e polyfills do Vitest
└── Dockerfile
```

React + Vite em **JavaScript** (ver [ADR-004](decisoes.md#adr-004)). Componentização por responsabilidade única com hook `useMensagem` e código legível e formatado ([ADR-017](decisoes.md#adr-017)). Sem biblioteca de estado global: `useState` e hooks locais.

## 4. Fluxo de uma transferência

```text
React (form) → POST /api/transferencias
  → nginx proxy → backend
    → TransferenciaHandler (controller) valida JSON → DTO
      → caso de uso Transferir
        → UnitOfWork.Executar(tx):
            ContaRepository.Buscar(origem), Buscar(destino)
            conta.Transferir(origem, destino, valor)   ← regras do R12 (pacote domain/conta)
            ContaRepository.Salvar(origem), Salvar(destino)
      ← erro de domínio? → handler mapeia para 404 / 422
  ← 200 com os saldos atualizados
```
