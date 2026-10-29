# Infraestrutura Docker — sistemabancarioporIA

> Especificação e configuração real dos containers Docker e orquestração via Docker Compose implementada e validada na fase P006 ([ADR-007](decisoes.md#adr-007), [ADR-013](decisoes.md#adr-013)).

## 1. Visão Geral da Topologia

A aplicação refatorada opera com **2 containers** interligados por uma **rede Docker bridge** isolada (`banco-net`), orquestrados pelo `docker-compose.yml`:

- **Navegador / Cliente externo:** acessa `http://localhost:3000`.
- **Frontend (`frontend`):** container rodando servidor Nginx como usuário não-root, servindo os arquivos estáticos da SPA React e atuando como proxy reverso para chamadas à API REST.
- **Backend (`backend`):** container rodando binário estático Go compilado em Alpine, expondo porta interna `8080` exclusivamente para a rede `banco-net`.
- **Persistência (`banco-data`):** volume nomeado Docker montado em `/data`, garantindo sobrevivência do banco SQLite (`/data/banco.db`) entre reinícios (`restart`).

---

## 2. Especificação dos Containers

### 2.1 Backend (`backend/Dockerfile`)
- **Build Stage:** `golang:1.25-alpine`
  - Compilação estática com `CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api`.
- **Runtime Stage:** `alpine:3.22`
  - Criação de grupo e usuário de sistema: `addgroup -S app && adduser -S app -G app` (`uid=100`, `gid=101`).
  - Diretório de dados `/data` com propriedade `app:app`.
  - Execução como usuário não-root: `USER app`.
  - Exposição de porta: `EXPOSE 8080` (não mapeada para o host).
  - Healthcheck: `wget -qO- http://localhost:8080/api/health`.

### 2.2 Frontend (`frontend/Dockerfile` e `frontend/nginx.conf`)
- **Build Stage:** `node:22-alpine`
  - Instalação determinística: `npm ci`.
  - Compilação de assets de produção: `npm run build` (gerando `dist/`).
- **Runtime Stage:** `nginx:1.29-alpine`
  - Criação de grupo e usuário de sistema: `addgroup -S app && adduser -S app -G app` (`uid=100`, `gid=102`).
  - Permissões em `/var/cache/nginx`, `/var/run` e `/usr/share/nginx/html`.
  - Ajuste de PID para `/tmp/nginx.pid` para compatibilidade com execução sem privilégios de root.
  - Execução como usuário não-root: `USER app`.
  - Porta publicada: `3000:80` (porta `3000` no host).
  - Proxy reverso: requisições em `/api/` são encaminhadas para `http://backend:8080`.
  - Roteamento SPA: `try_files $uri $uri/ /index.html;`.

---

## 3. Configuração do Docker Compose (`docker-compose.yml`)

```yaml
services:
  backend:
    build: ./backend
    environment:
      DB_PATH: /data/banco.db
      SEED: "true"
      PORT: "8080"
    volumes:
      - banco-data:/data
    networks:
      - banco-net
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/api/health"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 5s
    stop_grace_period: 10s
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - banco-net
    stop_grace_period: 10s
networks:
  banco-net:
    driver: bridge
volumes:
  banco-data:
```

### Características Críticas da Orquestração:
1. **Startup Ordenado e Healthcheck:** O serviço `frontend` aguarda o backend atingir o estado `healthy` através do healthcheck HTTP (`/api/health`), evitando erros de conexão inicial.
2. **Isolamento de Portas:** A porta `8080` do backend não é publicada no host. O backend só é alcançado pela rede bridge `banco-net` através do nome de serviço `backend`.
3. **Shutdown Gracioso (`stop_grace_period: 10s`):** Concede tempo hábil para que o shutdown de 5 segundos do backend Go feche conexões ativas e descarregue o banco SQLite com segurança antes de receber `SIGKILL`.
4. **Persistência de Dados:** O volume `banco-data` armazena o banco SQLite em `/data/banco.db`, preservando os cadastros e transações entre comandos `docker compose restart` ou `docker compose down` (sem a flag `-v`).

---

## 4. Como Executar

### 4.1 Subir a Aplicação Completa
```bash
docker compose up --build
```
*Caso seu terminal não possua permissões de grupo `docker` ativas no login atual, utilize:*
```bash
sg docker -c "docker compose up --build"
```

### 4.2 Acessar os Serviços
- **Aplicação Web (SPA React):** [http://localhost:3000](http://localhost:3000)
- **Healthcheck via Proxy:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **API REST via Proxy:** [http://localhost:3000/api/clientes](http://localhost:3000/api/clientes), [http://localhost:3000/api/contas](http://localhost:3000/api/contas)

### 4.3 Derrubar os Serviços
```bash
docker compose down
```
*Para limpar também o volume persistente (`banco-data`) e reiniciar com o seed original:*
```bash
docker compose down -v
```
