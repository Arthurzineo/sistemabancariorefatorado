# Relatório de Revisão — Fase P006 (PR #5, Rodada 2)

- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261022-002)
- **Autor da Entrega:** codex (contrato C-20261022-001)
- **Alvo:** PR #5 (`codex/p006-docker` -> `main`, commit `8ce0f63`)
- **Tarefas Cobertas:** T051, T052, T044
- **Resultado:** `approved`

---

## 1. Verificação das Correções Bloqueantes da Rodada 1

| Item | Bloqueante Apontado na R1 | Correção Aplicada em `8ce0f63` | Evidência de Teste / Verificação | Status |
|---|---|---|---|---|
| **1** | Falha de repetibilidade do teste E2E com IDs fixos `11` | `frontend/e2e/fluxo-bancario.spec.js` refatorado para usar IDs dinâmicos (`const id = String(Date.now()).slice(-7)`) e nomes dinâmicos | Executado `npm run e2e` duas vezes consecutivas sem recriar o volume (`banco-data`). Ambas as execuções foram 100% bem-sucedidas (1 passed em 1.4s e 1 passed em 1.2s). | **Resolvido** |
| **2** | Versão com circunflexo `"^1.56.1"` violando ADR-017 | `frontend/package.json` e `frontend/package-lock.json` atualizados para versão exata `"1.56.1"` | Verificado `package.json` e `package-lock.json`. `npm ci` rodou limpo (0 vulnerabilidades). | **Resolvido** |
| **3** | Ausência do script `e2e` em `package.json` | Adicionado `"e2e": "playwright test"` na seção `"scripts"` | Executado diretamente via `npm run e2e` com sucesso. | **Resolvido** |
| **4** | Ignorar artefatos do Playwright | `frontend/.gitignore` ignora `test-results/` e `playwright-report/` | `git status` permanece `working tree clean` após execuções do Playwright. | **Resolvido** |

---

## 2. Matriz Consolidada de Critérios de Aceite

| Tarefa | Critério de Aceite | Teste / Validação | Status |
|---|---|---|---|
| **T051** | As duas imagens buildam | `sg docker -c "docker compose up --build -d"` constrói multi-stage backend (Go/Alpine) e frontend (Vite/Nginx) sem falhas. | **Atendido** |
| **T051** | Containers rodam sem root | `docker compose exec backend id` -> `uid=100(app)`<br>`docker compose exec frontend id` -> `uid=100(app)` | **Atendido** |
| **T052** | Frontend chega ao backend pelo nome `backend` | Nginx encaminha `/api/` para `http://backend:8080`. `curl http://localhost:3000/api/health` retorna `{"status":"ok"}`. Backend não publica portas no host (acesso direto a `8080` recusado). | **Atendido** |
| **T052** | Dados sobrevivem a `docker compose restart` | Registro inserido persistiu no banco SQLite `/data/banco.db` após restart do container. | **Atendido** |
| **T044** | Pelo menos 1 fluxo E2E verde | `npm run e2e` executa fluxo completo (cadastro de conta, cadastro de cliente, transferência e validação de saldos atualizados). Passou 2x consecutivas no mesmo volume. | **Atendido** |

---

## 3. Evidências de Execução na Rodada 2

### 3.1 Testes Unitários e Build do Frontend
```bash
$ cd frontend && npm ci && npm test && npm run build
✓ 3 test files passed (26 tests passed)
✓ built in 133ms
```

### 3.2 Containers e Healthcheck
```
NAME                    IMAGE                 STATUS                    PORTS
agy-review-backend-1    agy-review-backend    Up 20 seconds (healthy)   8080/tcp
agy-review-frontend-1   agy-review-frontend   Up 14 seconds             0.0.0.0:3000->80/tcp
```
- Endpoint de saúde: `curl -s -i http://localhost:3000/api/health` -> HTTP 200 OK `{"status":"ok"}`.

### 3.3 Prova de Repetibilidade E2E (Dupla Execução Consecutiva)
```bash
$ cd frontend && npm run e2e
> playwright test
Running 1 test using 1 worker
  ✓  1 e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface (812ms)
  1 passed (1.4s)

$ cd frontend && npm run e2e
> playwright test
Running 1 test using 1 worker
  ✓  1 e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface (745ms)
  1 passed (1.2s)
```

### 3.4 Liberação da Porta 3000
Ambiente desmontado com `sg docker -c "docker compose down -v"` ao fim dos testes. Porta 3000 desocupada para validação do Chief.

---

## 4. Conclusão

Todas as 4 correções solicitadas na Rodada 1 foram implementadas com precisão e validadas dinamicamente. Os critérios de aceite de T051, T052 e T044 estão plenamente satisfeitos.

- **Bloqueantes:** Nenhum (0)
- **Importantes:** Nenhum (0)
- **Sugestões:** Nenhuma (0)

**Parecer:** `approved`
