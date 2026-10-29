# Relatório de Revisão — Fase P006 (PR #5, Rodada 1)

- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261022-002)
- **Autor da Entrega:** codex (contrato C-20261022-001)
- **Alvo:** PR #5 (`codex/p006-docker` -> `main`)
- **Tarefas Cobertas:** T051, T052, T044
- **Resultado:** `changes_requested`

---

## 1. Mapeamento Estrito: Critério de Aceite → Teste Comprobatório / Evidência

| Tarefa | Critério de Aceite | Evidência / Teste Executado | Resultado | Status |
|---|---|---|---|---|
| **T051** | As duas imagens buildam | `sg docker -c "docker compose up --build -d"` constrói multi-stage `backend` (Go em Alpine) e `frontend` (Vite em Nginx) sem erros. | Build concluído e containers inicializados | **Atendido** |
| **T051** | Containers rodam sem root | `docker compose exec backend id` -> `uid=100(app) gid=101(app)`<br>`docker compose exec frontend id` -> `uid=100(app) gid=102(app)` | Usuário não-root `app` em ambos os containers | **Atendido** |
| **T052** | Frontend chega ao backend pelo nome `backend` | Proxy Nginx configurado com `proxy_pass http://backend:8080`. Host acessa `http://localhost:3000/api/health` -> HTTP 200 `{"status":"ok"}` e `http://localhost:3000/api/clientes` (dados seed). Porta 8080 não é exposta diretamente no host (conexão recusada no host como esperado). | Comunicação isolada na rede `banco-net` via DNS `backend` | **Atendido** |
| **T052** | Dados sobrevivem a `docker compose restart` | Registro inserido via `POST http://localhost:3000/api/clientes` (`"Teste Persistencia"`). Executado `sg docker -c "docker compose restart"`. Consulta via `GET /api/clientes` confirmou que o cliente continuou persistido no volume `banco-data` (`/data/banco.db`). | Volume preservado após reinício | **Atendido** |
| **T044** | Pelo menos 1 fluxo E2E verde | Execução de `npx playwright test` em `frontend/e2e/fluxo-bancario.spec.js`. 1ª execução passou (1 passed). Porém, na 2ª execução com dados persistidos, falhou com timeout esperando `"Conta cadastrada"` devido a conflito de ID fixo (`id_duplicado`). | Falha de idempotência / repetibilidade | **Bloqueante** |

---

## 2. Evidências de Execução Dinâmica

### 2.1 Construção e Status dos Containers (`docker compose ps`)
```
NAME                    IMAGE                 COMMAND                  SERVICE    STATUS                    PORTS
agy-review-backend-1    agy-review-backend    "/app/api"               backend    Up 35 seconds (healthy)   8080/tcp
agy-review-frontend-1   agy-review-frontend   "/docker-entrypoint.…"   frontend   Up 29 seconds             0.0.0.0:3000->80/tcp
```
- O backend está com healthcheck ativo e saudável (`healthy`).
- O backend não publica porta no host (apenas porta interna exposta na rede).
- O frontend expõe a porta `3000:80`.

### 2.2 Verificação de Usuário Não-Root
```bash
$ sg docker -c "docker compose exec backend id"
uid=100(app) gid=101(app) groups=101(app)

$ sg docker -c "docker compose exec frontend id"
uid=100(app) gid=102(app) groups=102(app)
```

### 2.3 Roteamento e Proxy Reverso
```bash
$ curl -s -i http://localhost:3000 | head -n 8
HTTP/1.1 200 OK
Server: nginx/1.29.8
...
<!doctype html><html lang="pt-BR">...<div id="root"></div>...

$ curl -s -i http://localhost:3000/api/health
HTTP/1.1 200 OK
Server: nginx/1.29.8
Content-Type: application/json; charset=utf-8
{"status":"ok"}

$ curl -s -i --connect-timeout 2 http://localhost:8080/api/health
curl: (7) Failed to connect to localhost port 8080: Connection refused (isolamento correto da porta interna)
```

### 2.4 Persistência de Dados em Volume
1. Inserção: `POST /api/clientes` com `{"nome":"Teste Persistencia", "idade":28, "email":"teste@banco.com", "idContaCorrente":1}` -> Retorno HTTP 201 Created.
2. Reinício: `sg docker -c "docker compose restart"`.
3. Verificação pós-reinício: `GET /api/clientes` confirmou o cliente `"Teste Persistencia"` presente.

### 2.5 Execução Playwright E2E e Diagnóstico de Falha
Na primeira execução contra base limpa:
```
Running 1 test using 1 worker
  ✓  1 e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface (798ms)
  1 passed (1.3s)
```
Ao executar novamente sem recriar o volume (cenário real de CI/CD ou ambiente com dados já existentes):
```
Running 1 test using 1 worker
  ✘  1 e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface (5.4s)

  1) e2e/fluxo-bancario.spec.js:3:1 › cadastra conta, cliente e transfere valores pela interface 
    Error: expect(locator).toContainText(expected) failed
    Locator: getByRole('status')
    Expected substring: "Conta cadastrada"
    Timeout: 5000ms
```
Motivo: Os IDs de conta e cliente estão fixos em `11` no teste (`await cadastroConta.getByLabel('ID da conta').fill('11')`). Com a persistência ativa, a segunda tentativa recebe `id_duplicado` da API e não atinge o status esperado.

---

## 3. Achados

### 3.1 Bloqueantes (Changes Requested)

1. **Repetibilidade do Teste E2E (T044):**
   - O teste `frontend/e2e/fluxo-bancario.spec.js` deve ser idempotente/repetível. Utilizar IDs dinâmicos (ex: timestamp `Date.now() % 100000 + 10` ou equivalente numérico) para permitir execuções consecutivas bem-sucedidas com o volume ativo. Provar rodando duas vezes seguidas sem limpar o volume (`npx playwright test && npx playwright test`).
2. **Versão Exata em `package.json` (Violação de ADR-017):**
   - O arquivo `frontend/package.json` define `"@playwright/test": "^1.56.1"`. A ADR-017 exige expressamente versões exatas (sem `^` ou `~`). Alterar para `"1.56.1"` e atualizar o lockfile correspondente.
3. **Falta do script `e2e` em `package.json`:**
   - Adicionar o script `"e2e": "playwright test"` na seção `"scripts"` do `frontend/package.json`.
4. **Alinhamento do `.gitignore` na raiz do repositório:**
   - O `.gitignore` na raiz lista `/e2e/test-results/` e `/e2e/playwright-report/`, mas as saídas do Playwright são geradas dentro de `frontend/test-results/` e `frontend/playwright-report/`. Incluir esses caminhos no `.gitignore` da raiz (além do `frontend/.gitignore`).

### 3.2 Acompanhamento / Observações (Atendidos)
- **Graceful Shutdown (Nota A1 de P004):** `docker-compose.yml` incluiu `stop_grace_period: 10s`, perfeitamente compatível com o timeout de shutdown gracioso de 5s do backend em Go.

---

## 4. Conclusão

Os objetivos estruturais de Docker (T051 e T052) foram plenamente alcançados com imagens enxutas, containers não-root, rede interna privada e persistência em volume. Entretanto, o teste E2E (T044) e a conformidade com a ADR-017 demandam os 4 ajustes listados acima.

**Parecer:** `changes_requested`
