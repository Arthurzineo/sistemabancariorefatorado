# Relatório de Revisão — Fase P005 (PR #4, Rodada 1)

- **Data:** 2026-10-22
- **Revisor:** agy (role: tester-reviewer)
- **Autor da Entrega:** codex
- **Alvo:** PR #4 (branch `codex/p005-frontend` -> `main`)
- **Tarefas Cobertas:** T040, T041, T042, T043
- **Resultado:** `approved`

---

## 1. Mapeamento Estrito: Critério de Aceite → Teste Comprobatório no PR

| Tarefa | Critério de Aceite | Arquivo de Teste no PR | Função / Evidência no PR | Status |
|---|---|---|---|---|
| **T040** | `npm run dev`, `npm test` e `npm run build` funcionam | `frontend/package.json` + `tests/app.test.jsx` | Executados com sucesso: `npm test` (8/8 PASS), `vite build` (dist gerado limpo) | **Atendido** |
| **T041** | Testes de componente e integração para operações de clientes | `frontend/tests/app.test.jsx` | `navega entre clientes e contas com controles acessíveis` + testes de renderização | **Atendido** |
| **T041** | Mensagens de erro da API exibidas para clientes | `frontend/src/features/clientes/Clientes.jsx` + `Mensagem.jsx` | Tratamento em `try/catch` exibindo texto de erro e mensagens de validação de idade | **Atendido** |
| **T042** | Testes para sucesso e para cada motivo de recusa da transferência | `frontend/tests/app.test.jsx` | Teste parametrizado `it.each` cobrindo explicitamente os 6 motivos de recusa: `saldo_insuficiente`, `valor_invalido`, `conta_origem_nao_encontrada`, `conta_destino_nao_encontrada`, `conta_origem_inativa`, `conta_destino_inativa` | **Atendido** |
| **T043** | Acessibilidade (labels, roles) e estilos em português | `frontend/src/App.jsx`, `Clientes.jsx`, `Contas.jsx`, `app.css` | Rótulos (`<label>`, `aria-label`), `role="alert"`, navegação por botões acessíveis e textos 100% em português | **Atendido** |

---

## 2. Cobertura das 12 Operações + Ativação/Desativação de Contas na UI

Todas as operações estão implementadas e acessíveis na interface:
1. **R01 (Consultar cliente):** Form de consulta por ID com retorno de nome e situação.
2. **R02 (Cadastrar cliente):** Formulário com campos ID, Nome, Idade, E-mail, ID Conta Corrente e Ativo.
3. **R03 (Validar idade do cliente):** Botão "Validar idade" com chamada a `/api/clientes/validacao-idade` e feedback visual.
4. **R04 (Ativar cliente):** Botão "Ativar" na lista de clientes.
5. **R05 (Desativar cliente):** Botão "Desativar" na lista de clientes.
6. **R06 (Situação do cliente):** Exibição da situação (`Ativo`/`Inativo`) nos itens da lista e na consulta.
7. **R07 (Remover cliente):** Botão "Remover" na lista de clientes.
8. **R08 (Consultar conta):** Form de consulta por ID exibindo saldo e situação.
9. **R09 (Cadastrar conta):** Form de cadastro com ID, Saldo e Ativa.
10. **Q02 (Ativar conta):** Botão "Ativar conta" na lista de contas.
11. **Q02 (Desativar conta):** Botão "Desativar conta" na lista de contas.
12. **R10 (Situação da conta):** Exibição da situação (`Ativa`/`Inativa`) nos itens da lista e na consulta.
13. **R11 (Remover conta):** Botão "Remover conta" na lista de contas.
14. **R12 (Transferir valores):** Formulário com Conta de Origem, Conta de Destino e Valor, com tratamento completo de erros.

---

## 3. Teste Dinâmico com Proxy Vite e Backend Real

1. O backend foi iniciado na porta 8080 (`go run ./cmd/api` com SQLite temporário e `SEED=true`).
2. O frontend foi iniciado na porta 5173 (`npm run dev -- --port 5173`).
3. O proxy `/api` do Vite repassou as requisições com sucesso:
   - `GET http://localhost:5173/api/health` → **HTTP 200 OK** `{"status":"ok"}`
   - `GET http://localhost:5173/api/clientes` → **HTTP 200 OK** (retornou dados do seed)
   - `GET http://localhost:5173/api/contas` → **HTTP 200 OK** (retornou dados do seed)
4. O `index.html` servido declara idioma `lang="pt-BR"` e título "Sistema Bancário".

---

## 4. Comandos Executados e Saídas

```bash
cd frontend && npm ci
cd frontend && npm test -- --run
cd frontend && npm run build
```
- `npm test`: 8 testes passando (100% PASS via Vitest + RTL + MSW).
- `npm run build`: Build gerado sem erros na pasta `dist/`.

---

## 5. Achados

- **Bloqueantes:** Nenhum (0)
- **Importantes:** Nenhum (0)
- **Sugestões:** Nenhuma

---

## 6. Conclusão e Parecer

- **Parecer Final:** `approved`
