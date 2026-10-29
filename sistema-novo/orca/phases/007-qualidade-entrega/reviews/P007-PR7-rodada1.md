# Relatório de Revisão — Fase P007 (PR #7, Rodada 1)

- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261022-002, Aditivo A1)
- **Autor da Entrega:** codex (contrato C-20261022-001)
- **Alvo:** PR #7 (`codex/p007-correcoes` -> `main`, commits `8374b73`, `90217c2`, `f7ede56`)
- **Escopo:** Remediação dos achados de Código (T060) e Segurança (T061)
- **Resultado:** `approved`

---

## 1. Mapeamento Estrito: Achado → Correção no PR → Teste / Evidência

| ID do Achado | Severidade | Descrição do Problema | Correção Implementada no PR | Teste / Evidência Comprobatória | Status |
|---|---|---|---|---|---|
| **T061-S01 / T060-A01** | **Alta** | Transferência para a mesma conta (`origem == destino`) gerava crédito indevido (criação de dinheiro) | `domain/conta/transferencia.go` e `application/conta/servico.go` rejeitam `origemID == destinoID` com `ErrMesmaConta`. Mapeado para HTTP 422 `mesma_conta` | `transferencia_test.go` (`TestTransferirRecusaMesmaConta`), `servico_test.go` (`TestTransferenciaMesmaContaNaoAlteraSaldo`), `router_test.go` (`TestTransferenciaMesmaContaRetorna422`), BDD `transferir_valores.feature` (Cenário: Transferência para a mesma conta) | **Resolvido** |
| **T061-S02** | **Média** | Falta de limite de tamanho no corpo das requisições (risco DoS) | `decodificar` em `router.go` protege `r.Body` com `stdhttp.MaxBytesReader(w, r.Body, 1<<20)`. Retorna HTTP 413 `corpo_muito_grande` se exceder 1 MiB | `router_test.go` (`TestRouterRecusaIDsNaoPositivosECorpoGrande` com payload de 2 MiB retornando status 413) | **Resolvido** |
| **T061-S03** | **Média** | Servidor HTTP Go vulnerável a Slowloris por ausência de timeouts | `cmd/api/main.go` configura timeouts explícitos: `ReadHeaderTimeout: 5s`, `ReadTimeout: 10s`, `WriteTimeout: 15s`, `IdleTimeout: 60s` | Inspeção de código em `cmd/api/main.go` | **Resolvido** |
| **T061-S04** | **Média** | Aceitação de IDs negativos ou zero (`id <= 0`) em rotas e cadastro | `idDaRota` rejeita `id <= 0` com HTTP 422 `id_invalido`. Entidades `cliente.Novo` e `conta.Nova` retornam `ErrIDInvalido` se `id <= 0` | `router_test.go` (valida `/api/clientes/0`, `/-1`, `/api/contas/0`) e `cliente_security_test.go` | **Resolvido** |
| **T061-S05** | **Baixa** | Ausência de Security Headers e versão exposta no Nginx | `frontend/nginx.conf` adiciona `server_tokens off;`, `X-Frame-Options "DENY"`, `X-Content-Type-Options "nosniff"` e `Referrer-Policy "no-referrer"` | Exercitado dinamicamente via `curl -s -i http://localhost:3000/api/health` confirmando os headers e remoção da versão | **Resolvido** |
| **T061-S06** | **Baixa** | Ausência de validação sintática em nome e email no cliente | `domain/cliente/cliente.go` valida `strings.TrimSpace(nome) != ""` (`ErrNomeInvalido`) e email contendo `@` (`ErrEmailInvalido`) | `cliente_security_test.go` (`TestNovoRecusaIdentificadorNomeEEmailInvalidos`) | **Resolvido** |
| **T060-A03** | **Baixa** | SQLite sem WAL mode | `adapters/sqlite/banco.go` ativa `PRAGMA journal_mode = WAL;` na inicialização do banco | `banco.go` e `sqlite_test.go` | **Resolvido** |
| **T061-S07** | **Baixa** | Ausência de limites de CPU/memória no Compose | `docker-compose.yml` adiciona bloco `deploy.resources.limits` para backend (1 CPU, 512M) e frontend (1 CPU, 256M) | `docker-compose.yml` validado na inicialização do compose | **Resolvido** |

---

## 2. Evidências de Execução Automatizada

### 2.1 Backend (Go Vet e Testes Completos)
```bash
$ cd backend && go vet ./... && go test -v ./...
ok  backend/internal/adapters/http       0.010s (6 testes passando)
ok  backend/internal/adapters/memory     0.002s (3 testes passando)
ok  backend/internal/adapters/sqlite     0.016s (3 testes passando)
ok  backend/internal/application/cliente 0.002s (4 testes passando)
ok  backend/internal/application/conta   0.001s (5 testes passando)
ok  backend/internal/domain/cliente      0.001s (4 testes passando)
ok  backend/internal/domain/conta        0.001s (7 testes passando)
ok  backend/internal/seed                0.002s (1 teste passando)
ok  backend/tests/bdd                    0.015s (18 cenários BDD, 85 steps — 100% PASS)
ok  backend/tests/contract               0.025s (2 testes de contrato passando)
```
- Total: 35 testes unitários/integração + 18 cenários BDD (85 steps). 100% de sucesso.

### 2.2 Frontend (Testes Unitários e Build)
```bash
$ cd frontend && npm test && npm run build
✓ 3 test files passed (26 tests passed)
✓ built in 101ms
```

### 2.3 Docker Compose e Headers HTTP
```bash
$ curl -s -i http://localhost:3000/api/health
HTTP/1.1 200 OK
Server: nginx
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Content-Type: application/json; charset=utf-8

{"status":"ok"}
```

### 2.4 Teste Ponta a Ponta (Playwright E2E)
```bash
$ cd frontend && npm run e2e
Running 1 test using 1 worker
  ✓  1 e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface (735ms)
  1 passed (1.2s)
```

---

## 3. Conclusão

O PR #7 implementou todas as correções solicitadas de forma exemplar, seguindo o fluxo TDD (commits RED `8374b73` e GREEN `90217c2` + refinamento `f7ede56`), preservando a arquitetura hexagonal e elevando substancialmente o nível de segurança e robustez da solução.

- **Bloqueantes:** Nenhum (0)
- **Importantes:** Nenhum (0)
- **Sugestões:** Nenhuma (0)

**Parecer:** `approved`
