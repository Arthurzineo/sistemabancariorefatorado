# Relatório de Revisão — Fase P004 (PR #3, Rodada 1)

- **Data:** 2026-10-22
- **Revisor:** agy (role: tester-reviewer)
- **Autor da Entrega:** codex
- **Alvo:** PR #3 (branch `codex/p004-api-http-bdd` -> `main`)
- **Tarefas Cobertas:** T030, T031, T032
- **Resultado:** `approved`

---

## 1. Mapeamento Estrito: Critério de Aceite → Teste Comprobatório no PR

Conforme a regra mandatória de garantia de qualidade (critério sem teste = bloqueante):

| Tarefa | Critério de Aceite | Arquivo de Teste no PR | Função / Evidência no PR | Status |
|---|---|---|---|---|
| **T030** | Testes `httptest` para todas as rotas de `docs/api.md` | `backend/internal/adapters/http/router_test.go` | `TestHealth`, `TestRotasDeClientesEContas`, `TestTransferenciaEMapeamentoDeErros` | **Atendido** |
| **T030** | Todos os erros de domínio mapeados para códigos HTTP/JSON | `backend/internal/adapters/http/router_test.go` | `TestMapearTodosOsErrosDoDominio` (valida status 404, 409, 422 e mensagens de erro tipadas) | **Atendido** |
| **T031** | `go run ./cmd/api` responde em `/api/health` | `backend/cmd/api/main.go` + Verificação dinâmica (curl) | Exercitado dinamicamente via processo real na porta 8089 com retorno HTTP 200 `{"status":"ok"}` | **Atendido** |
| **T032** | 15 cenários BDD originais verdes + cenários de transferência com conta inativa (ADR-011) | `backend/tests/bdd/bdd_test.go` e `features/` | `TestFeatures` executando 17 cenários (15 originais + 2 cenários de conta inativa no Gherkin) | **Atendido** |
| **T032** | Novos cenários para situação/remoção e motivos de transferência | `backend/features/` + `tests/bdd/bdd_test.go` | Cenários de ativação/desativação, consulta e motivos de recusa em `transferir_valores.feature` | **Atendido** |

---

## 2. Teste Dinâmico de Ponta a Ponta da API Real (Exercício via `curl`)

O binário foi executado localmente no worktree com banco temporário (`DB_PATH=/tmp/test_api_banco.db SEED=true PORT=8089 go run ./cmd/api`) e todas as rotas descritas em `docs/api.md` foram exercitadas com seus respectivos códigos de retorno:

### 2.1 Saúde e Configuração
- `GET /api/health` → **HTTP 200 OK** `{"status":"ok"}`

### 2.2 Clientes
- `GET /api/clientes` (listagem Q03) → **HTTP 200 OK** (retornou os clientes do seed)
- `GET /api/clientes/1` (consulta R01) → **HTTP 200 OK**
- `GET /api/clientes/99` (consulta inexistente) → **HTTP 404 Not Found** `{"erro":"cliente_nao_encontrado",...}`
- `POST /api/clientes` (cadastro válido R02/R03) → **HTTP 201 Created**
- `POST /api/clientes` (id duplicado R02) → **HTTP 409 Conflict** `{"erro":"id_duplicado",...}`
- `POST /api/clientes` (idade 17 inválida R03) → **HTTP 422 Unprocessable Entity** `{"erro":"idade_nao_permitida",...}`
- `POST /api/clientes` (JSON malformado) → **HTTP 400 Bad Request** `{"erro":"requisicao_invalida",...}`
- `GET /api/clientes/validacao-idade?idade=25` → **HTTP 200 OK** `{"idade":25,"mensagem":"idade permitida","permitida":true}`
- `GET /api/clientes/validacao-idade?idade=17` → **HTTP 200 OK** `{"idade":17,"mensagem":"idade nao permitida","permitida":false}`
- `GET /api/clientes/validacao-idade?idade=abc` → **HTTP 400 Bad Request**
- `POST /api/clientes/1/desativar` (R05) → **HTTP 200 OK** `{"situacao":"Inativo",...}`
- `GET /api/clientes/1/situacao` (R06) → **HTTP 200 OK** `{"situacao":"Inativo"}`
- `POST /api/clientes/1/ativar` (R04) → **HTTP 200 OK** `{"situacao":"Ativo",...}`
- `DELETE /api/clientes/3` (R07) → **HTTP 204 No Content**
- `GET /api/clientes/3` → **HTTP 404 Not Found**

### 2.3 Contas Correntes
- `GET /api/contas` (listagem Q03) → **HTTP 200 OK** (retornou contas 1 e 2 do seed)
- `GET /api/contas/1` (consulta R08) → **HTTP 200 OK** `{"id":1,"saldo":100,"situacao":"Ativa"}`
- `GET /api/contas/99` → **HTTP 404 Not Found** `{"erro":"conta_nao_encontrada",...}`
- `POST /api/contas` (cadastro R09) → **HTTP 201 Created**
- `POST /api/contas` (id duplicado) → **HTTP 409 Conflict** `{"erro":"id_duplicado",...}`
- `POST /api/contas/10/desativar` (Q02) → **HTTP 200 OK** `{"situacao":"Inativa",...}`
- `GET /api/contas/10/situacao` (R10) → **HTTP 200 OK** `{"situacao":"Inativa"}`
- `POST /api/contas/10/ativar` (Q02) → **HTTP 200 OK** `{"situacao":"Ativa",...}`
- `DELETE /api/contas/10` (R11) → **HTTP 204 No Content**
- `GET /api/contas/10` → **HTTP 404 Not Found**

### 2.4 Transferências (R12 / ADR-011)
- `POST /api/transferencias` (`origem: 1, destino: 2, valor: 40.0`) → **HTTP 200 OK** (origem: 60, destino: 140)
- `POST /api/transferencias` (`valor: 500.0` - saldo insuficiente) → **HTTP 422 Unprocessable Entity** `{"erro":"saldo_insuficiente",...}`
- `POST /api/transferencias` (`valor: -10.0` - valor inválido) → **HTTP 422 Unprocessable Entity** `{"erro":"valor_invalido",...}`
- `POST /api/transferencias` (`origem: 99` - inexistente) → **HTTP 404 Not Found** `{"erro":"conta_origem_nao_encontrada",...}`
- `POST /api/transferencias` (`destino: 99` - inexistente) → **HTTP 404 Not Found** `{"erro":"conta_destino_nao_encontrada",...}`
- `POST /api/transferencias` (com conta de origem inativa) → **HTTP 422 Unprocessable Entity** `{"erro":"conta_origem_inativa",...}`
- `POST /api/transferencias` (com conta de destino inativa) → **HTTP 422 Unprocessable Entity** `{"erro":"conta_destino_inativa",...}`

---

## 3. Verificação Estática e Suíte de Testes Automatizados

```bash
cd backend && go vet ./...
cd backend && go test -v ./...
```
**Resultado:** Sucesso sem avisos (100% PASS).
- `internal/adapters/http`: 4 testes de integração HTTP passando
- `internal/adapters/memory`: 3 testes passando
- `internal/adapters/sqlite`: 3 testes passando
- `internal/application/cliente`: 4 testes passando
- `internal/application/conta`: 4 testes passando
- `internal/domain/cliente`: 3 testes passando
- `internal/domain/conta`: 6 testes passando
- `tests/contract`: 2 testes de contrato passando
- `tests/bdd`: 17 cenários godog (80 steps) passando

---

## 4. Achados

- **Bloqueantes:** Nenhum (0)
- **Importantes:** Nenhum (0)
- **Sugestões:**
  - **A1:** Na inicialização em `main.go`, o encerramento gracioso via `srv.Shutdown` utiliza timeout de 5 segundos; assegurar em P006 que o healthcheck do container e o docker-compose configurem stop_grace_period compatível.

---

## 5. Conclusão e Parecer

- **Parecer Final:** `approved`
