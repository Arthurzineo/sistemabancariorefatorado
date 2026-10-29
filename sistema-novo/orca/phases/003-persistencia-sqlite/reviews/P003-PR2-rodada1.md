# Relatório de Revisão — Fase P003 (PR #2, Rodada 1)

- **Data:** 2026-10-22
- **Revisor:** agy (role: tester-reviewer)
- **Autor da Entrega:** codex
- **Alvo:** PR #2 (branch `codex/p003-persistencia-sqlite` -> `main`)
- **Tarefas Cobertas:** T023, T020, T021, T022
- **Resultado:** `approved`

---

## 1. Verificação Estrita dos Critérios de Aceite por Tarefa

### 1.1 Tarefa T023 — Completar T014 (Portas, Persistência Explícita, UoW e Contrato)
- [x] **Teste RED comprovando que alterar entidade buscada sem `Atualizar` não altera o repositório:**
  - Evidência: commit `e7533dc` (`test(T023): RED - exige atualizacao explicita`) implementando `TestBuscarRetornaCopiaQueExigeAtualizar`. Os repositórios em memória retornam cópias (`Copia()`), exigindo chamada a `Atualizar()`.
- [x] **Transferência e operações de mutação chamando `Atualizar()` explicitamente:**
  - `Ativar()` e `Desativar()` em cliente e conta persistem explicitamente via `s.repositorio.Atualizar(...)`.
  - `Transferir()` persiste explicitamente tanto a origem quanto o destino.
- [x] **UnitOfWork em memória:**
  - Evidência: commits `05ceeac` (`RED - rollback em unit of work`) e `4dec4e4` (`GREEN - adiciona unit of work em memoria`). `TestUnitOfWorkDescartaAlteracoesEmErro` valida rollback completo em caso de falha.
- [x] **Suíte de contrato em `backend/tests/contract/`:**
  - `memory_test.go` cobre unicidade de ID, atualização persistida, busca e remoção.

### 1.2 Tarefa T020 — DAOs SQLite de Cliente e Conta + Migrations
- [x] **Uso de `modernc.org/sqlite` sem CGO (ADR-005):**
  - Implementado em `backend/internal/adapters/sqlite/banco.go`.
- [x] **Criação e migração de schema:**
  - Tabelas `clientes` e `contas` com chaves primárias e tipos compatíveis criadas via `Migrar()`.
- [x] **DAOs implementando as interfaces de porta (`ports.ClienteRepository` e `ports.ContaRepository`):**
  - Implementados com queries parametrizadas SQL (`INSERT`, `UPDATE`, `SELECT`, `DELETE`).
- [x] **Isolamento de Domínio:**
  - O pacote `internal/domain` não importa nada de SQLite ou dependências externas.
- [x] **Contrato testado contra SQLite:**
  - Validado via teste unitário de adapter e complementado pelo teste de contrato de SQLite adicionado pela revisão (`sqlite_test.go` no commit `5fbbd0e`).

### 1.3 Tarefa T021 — Unit of Work e Transações no SQLite
- [x] **Execução transacional atômica com rollback:**
  - Implementado em `backend/internal/adapters/sqlite/unit_of_work.go` utilizando `Begin()`, `Rollback()` e `Commit()`.

### 1.4 Tarefa T022 — Seed dos Dados Iniciais
- [x] **Carga inicial de dados (Maria, Felipe, contas 1 e 2):**
  - Implementado em `backend/internal/seed/seed.go`.
- [x] **Idempotência (não duplica ao reiniciar):**
  - Checa existência antes de inserir (`Buscar(id)`).
  - Validado por teste automatizado `internal/seed/seed_test.go` adicionado no commit `5fbbd0e`.

---

## 2. Comandos Executados e Resultados dos Testes

### 2.1 Compilação Estática e Vet
```bash
cd backend && go vet ./...
```
**Resultado:** Sucesso sem avisos ou erros.

### 2.2 Suíte de Testes
```bash
cd backend && go test -v ./...
```
**Resultado:** Todos os testes passaram (100% PASS), cobrindo:
- `internal/adapters/memory`: 3 testes (busca como cópia, listar seguro, UoW rollback)
- `internal/adapters/sqlite`: 2 testes (schema migration, persistência de atualização)
- `internal/application/cliente`: 4 testes
- `internal/application/conta`: 3 testes
- `internal/domain/cliente`: 3 testes
- `internal/domain/conta`: 6 testes
- `internal/seed`: 1 teste (idempotência)
- `tests/contract`: 2 testes (contrato para memory e sqlite)

---

## 3. Testes Adicionais Implementados no Branch de Revisão (`agy/review-p003`)
Commit `5fbbd0e` enviado ao repositório remoto:
1. `backend/tests/contract/sqlite_test.go`: execução formal do contrato de repositório contra banco SQLite em memória.
2. `backend/internal/seed/seed_test.go`: teste de idempotência da rotina de seed em execuções repetidas.

---

## 4. Achados

### A1 — Sugestão: Parametrização da Suíte de Contrato
- **Severidade:** Sugestão
- **Localização:** `backend/tests/contract/`
- **Descrição:** Atualmente há testes separados para `memory` e `sqlite`. Para fases futuras onde novos repositórios possam surgir, uma função auxiliar genérica `executarContratoConta(t *testing.T, repo ports.ContaRepository)` facilitará a reutilização idêntica entre implementações.

### A2 — Sugestão: Integração direta do UoW na assinatura do caso de uso Transferir
- **Severidade:** Sugestão
- **Localização:** `backend/internal/application/conta/servico.go:59`
- **Descrição:** O serviço de conta atualmente realiza o `Transferir` chamando `Atualizar` sequencialmente no repositório. O `UnitOfWork` foi entregue nos adapters (memory e sqlite). Na P004 (camada HTTP/MVC), integrar o UoW no dispatch da transferência para garantir que a transação envolva o UoW diretamente na camada de aplicação.

---

## 5. Conclusão e Parecer

- **Bloqueantes:** Nenhum (0)
- **Importantes:** Nenhum (0)
- **Sugestões:** 2 (A1, A2)
- **Parecer Final:** `approved`
