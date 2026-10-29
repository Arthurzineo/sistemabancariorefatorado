# Relatório de Revisão de Segurança — Tarefa T061

- **Fase:** P007 — Qualidade e Entrega
- **Tarefa:** T061 — Revisão de segurança (entrada, containers, dependências)
- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261022-002, Aditivo A1)
- **Alvo:** Repositório `sistemabancariorefatorado` em `main` (commit `6cfcd35`)
- **Skills Aplicadas:** `secure-software-engineering`, `dependency-supply-chain`

---

## 1. Escopo e Vetores de Análise

A auditoria cobriu a superfície de ataque em múltiplas camadas do sistema:
1. **Validação de Entrada da API:** JSON malformado, integridade de tipos, restrições numéricas, limites de corpo e regras de negócio atômicas.
2. **Servidor HTTP e Resiliência:** Proteção contra exaustão de conexões, timeouts e ataques de negação de serviço (DoS/Slowloris).
3. **Servidor Web e Proxy (Nginx):** Cabeçalhos de segurança, CORS e vazamento de metadados/versões.
4. **Infraestrutura e Containers:** Privilégios de processo (não-root), tags de imagens, isolamento de rede e limites de recursos.
5. **Cadeia de Suprimentos (Supply Chain):** Auditoria de vulnerabilidades em dependências (Go e npm) e verificação de segredos versionados.

---

## 2. Análise Detalhada por Camada

### 2.1 Validação de Entrada na API REST (Go)
- **JSON e Decodificação:** A função `decodificar` em `router.go` rejeita adequadamente JSON malformado retornando HTTP 400 `{"erro":"requisicao_invalida","mensagem":"JSON invalido"}`.
- **Tamanho de Payload (Body Size):** O leitor `r.Body` é lido diretamente por `json.NewDecoder(r.Body)` **sem restrição de tamanho máximo**. Uma requisição com corpo arbitrariamente grande pode causar consumo excessivo de memória no container (*Resource Exhaustion / DoS*).
- **Validação de Identificadores (IDs):**
  - A função `idDaRota` converte o parâmetro com `strconv.Atoi`, mas **não valida se `id <= 0`**. Requisições com IDs negativos ou zero (ex: `GET /api/clientes/-1`) são repassadas ao banco.
  - No cadastro (`POST /api/clientes` e `POST /api/contas`), o payload aceita `id <= 0`, permitindo criar registros anômalos no SQLite.
- **Integridade Contábil na Transferência (Falha Crítica):**
  - Se uma requisição enviar `{"origem": 1, "destino": 1, "valor": 50}`, a API busca duas cópias da mesma conta no repositório. Em seguida, subtrai 50 de uma cópia e soma 50 na outra. Ao persistir sequencialmente, o segundo update sobrescreve o saldo com o valor acrescido (+50), gerando crédito indevido para o usuário.
- **Validação de Dados Cadastrais:** O domínio valida estritamente a faixa etária (18 a 65 anos), mas não valida se `nome` está em branco ou se `email` possui formato válido.

### 2.2 Resiliência do Servidor HTTP Backend (Go)
- Em `backend/cmd/api/main.go`, o servidor é instanciado como:
  ```go
  srv := &http.Server{Addr: ":" + port, Handler: httpadapter.NovoRouter(...)}
  ```
- O servidor **não configura timeouts de conexão** (`ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`). Conexões HTTP lentas mantidas abertas por atacantes podem preencher o limite de file descriptors do processo (vulnerabilidade clássica a ataques *Slowloris*).

### 2.3 Camada de Borda e Proxy Reverso (Nginx)
- O arquivo `frontend/nginx.conf` define o roteamento básico para `/api/` e `/`, mas:
  - **Falta `server_tokens off;`:** O Nginx emite o cabeçalho `Server: nginx/1.29.8`, expondo publicamente sua versão exata.
  - **Faltam Cabeçalhos de Segurança Defensivos:** Não há configuração de `X-Frame-Options` (risco de clickjacking), `X-Content-Type-Options: nosniff` (risco de MIME-sniffing), `Referrer-Policy`, ou `Content-Security-Policy`.

### 2.4 Isolamento de Containers e Docker Compose
- **Privilégios:** Ambos os containers executam estritamente como usuário não-root `app` (`uid=100`), satisfazendo o princípio de menor privilégio.
- **Isolamento de Rede:** O backend não publica nenhuma porta no host (porta 8080 exposta apenas na rede bridge interna `banco-net`). Apenas a porta 3000 do Nginx é mapeada externamente.
- **Tags de Imagem:** Imagens base fixadas em versões específicas (`golang:1.25-alpine`, `alpine:3.22`, `node:22-alpine`, `nginx:1.29-alpine`), sem uso de `:latest`.
- **Limites de Recursos:** O `docker-compose.yml` não especifica limites de CPU e memória (`deploy.resources.limits`), permitindo consumo irrestrito dos recursos do host.

### 2.5 Cadeia de Suprimentos e Segredos
- **Auditoria npm:** `npm audit` executado no diretório `frontend` resultou em **0 vulnerabilidades** conhecidas.
- **Auditoria Go:** Apenas duas dependências externas diretas (`modernc.org/sqlite` e `github.com/cucumber/godog`), com hashes e integridade verificados no `go.sum`. Sem uso de CGO.
- **Varredura de Segredos:** Nenhuma chave privada, token de API, senha ou arquivo `.env` foi detectado no histórico ou na árvore de trabalho do Git.

---

## 3. Tabela Consolidada de Achados de Segurança

| ID | Título | Severidade | Componente Afetado | Impacto |
|---|---|---|---|---|
| **T061-S01** | Quebra de integridade contábil em transferência para a própria conta | **Alta** | `domain/conta`, `application/conta` | Criação indevida de saldo / inflação de valores |
| **T061-S02** | Ausência de limite de tamanho no corpo das requisições HTTP | **Média** | `adapters/http/router.go` | Esgotamento de memória / Negação de serviço (DoS) |
| **T061-S03** | Servidor HTTP sem timeouts de conexão (Slowloris) | **Média** | `cmd/api/main.go` | Esgotamento de descritores de arquivo / DoS |
| **T061-S04** | Aceitação de IDs inteiros negativos ou zero (`id <= 0`) | **Média** | `adapters/http/router.go`, `domain` | Inconsistência de chaves e persistência de dados anômalos |
| **T061-S05** | Ausência de Security Headers e vazamento de versão no Nginx | **Baixa** | `frontend/nginx.conf` | Divulgação de banner e ausência de defesa contra MIME/Clickjacking |
| **T061-S06** | Ausência de validação sintática de nome e e-mail no cliente | **Baixa** | `domain/cliente/cliente.go` | Persistência de nomes vazios e e-mails inválidos |
| **T061-S07** | Ausência de limites de recursos no Docker Compose | **Baixa** | `docker-compose.yml` | Possibilidade de starvation de recursos no host |

---

## 4. Detalhamento dos Achados e Recomendações de Correção

### [T061-S01] Transferência para a Mesma Conta (`origem == destino`)
- **Severidade:** **Alta**
- **Cenário de Exploração:** Um usuário com saldo de R$ 100 na conta 1 envia `POST /api/transferencias` com `{"origem": 1, "destino": 1, "valor": 50}`. O saldo final resulta em R$ 150.
- **Mitigação Recomendada:**
  - Em `conta.Transferir`: se `origem.ID() == destino.ID()`, retornar `ErrContaOrigemEDestinoIguais`.
  - Em `servico.Transferir`: se `origemID == destinoID`, retornar erro sem executar transação.
  - Em `router.go`: mapear esse erro para HTTP 422 `{"erro": "contas_iguais", "mensagem": "conta de origem e destino devem ser diferentes"}`.

### [T061-S02] Limite de Tamanho no Corpo HTTP (`MaxBytesReader`)
- **Severidade:** **Média**
- **Mitigação Recomendada:**
  - Na função `decodificar` em `router.go`, envolver `r.Body` com `http.MaxBytesReader`:
    ```go
    r.Body = stdhttp.MaxBytesReader(w, r.Body, 1<<20) // limite de 1 MB
    ```

### [T061-S03] Configuração de Timeouts no Servidor HTTP
- **Severidade:** **Média**
- **Mitigação Recomendada:**
  - Em `backend/cmd/api/main.go`, definir timeouts explícitos na struct `http.Server`:
    ```go
    srv := &http.Server{
        Addr:              ":" + port,
        Handler:           httpadapter.NovoRouter(...),
        ReadHeaderTimeout: 5 * time.Second,
        ReadTimeout:       10 * time.Second,
        WriteTimeout:      15 * time.Second,
        IdleTimeout:       60 * time.Second,
    }
    ```

### [T061-S04] Restrição Estrita de IDs Positivos (`id > 0`)
- **Severidade:** **Média**
- **Mitigação Recomendada:**
  - Em `idDaRota`: validar `if id <= 0 { erro(w, 400, "requisicao_invalida", "id deve ser positivo"); return 0, false }`.
  - Em `POST /api/clientes` e `POST /api/contas`: rejeitar `in.ID <= 0`.
  - Nas entidades `cliente.Novo` e `conta.Nova`: retornar erro se `id <= 0`.

### [T061-S05] Hardening de Cabeçalhos HTTP no Nginx
- **Severidade:** **Baixa**
- **Mitigação Recomendada:**
  - Em `frontend/nginx.conf`, adicionar dentro do bloco `server`:
    ```nginx
    server_tokens off;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    ```

### [T061-S06] Validação de Dados Cadastrais do Cliente
- **Severidade:** **Baixa**
- **Mitigação Recomendada:**
  - Em `domain/cliente/cliente.go`, validar que `strings.TrimSpace(nome) != ""` e `strings.TrimSpace(email) != ""` (com validação básica de `@`), retornando erro de domínio amigável.

---

## 5. Parecer Final da Revisão T061

A arquitetura geral apresenta excelente postura defensiva inicial (containers não-root, ausência de portas expostas no host, SQL parametrizado sem injeção, zero vulnerabilidades conhecidas em pacotes).

Entretanto, as vulnerabilidades lógicas e de resiliência listadas nos itens **[T061-S01]** a **[T061-S04]** requerem remediação prioritária pelo Codex no branch `codex/p007-correcoes` para garantir a integridade contábil e a estabilidade da aplicação bancária.
