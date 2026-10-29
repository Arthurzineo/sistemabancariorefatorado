# Relatório de Revisão — Fase P008 (PR #8, Rodada 1)

- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261023-005)
- **Autor da Entrega:** codex (contrato C-20261023-004)
- **Alvo:** PR #8 (`codex/p008-redesign-frontend` -> `main`, commits `7c864fd`, `ce4afda`, `5892646`, `2b748b0`)
- **Escopo:** Redesign moderno e acessível do frontend (T080–T084, `docs/design-frontend.md` §1–§8, ADR-020)
- **Resultado:** `changes_requested`

---

## 1. Veredito e Resumo Executivo

A entrega do PR #8 apresenta avanços na fundação de tokens semânticos (`tokens.css`), na inclusão de `ThemeToggle` funcional e na tela de Visão Geral (`VisaoGeral.jsx`). Contudo, a implementação falha em cumprir requisitos centrais de arquitetura, acessibilidade, fidelidade ao design especificado em `docs/design-frontend.md` e qualidade de código (ADR-017).

A revisão visual e de código identificou que telas essenciais mantiveram estruturas legadas ou sofreram adaptações superficiais (botões cinzas nativos, ausência de grade de cartões em contas, tabela de clientes sem versão em cartões no mobile, forms sem dialog, campos colados sem uso de `<Field>`, ausência de componentes base obrigatórios como `Select` e `Icon`, e o fluxo de transferência em 3 passos funcionando apenas como alternativa secundária). Além disso, há código minificado/aglomerado em arquivos CSS e JSX, severa carência de testes para os componentes base, e capturas de tela incompletas (ausência do tema claro para a maioria das telas e ausência do recibo).

O veredito é **CHANGES_REQUESTED**, com 10 bloqueantes detalhados abaixo para correção na Rodada 2.

---

## 2. Matriz de Avaliação dos Critérios de Aceite (T080–T084)

| Tarefa | Critério de Aceite | Avaliação | Status |
|---|---|---|---|
| **T080** | Componentes só usam tokens semânticos | Parcial; tokens foram definidos, mas muitos elementos continuam sem estilização | **Reprovado** |
| **T080** | Alternância de tema funciona e é lembrada | Funcional via `ThemeToggle` | **Aprovado** |
| **T080** | Componentes base (§5: Button, Card, StatCard, StatusChip, Field, Select, Dialog, ConfirmDialog, Toast, EmptyState, Skeleton, Icon) | `Select` e `Icon` ausentes; `Field` não é usado; botões de ação usam `<button>` cru; código minificado | **Reprovado** |
| **T080** | Testes de cada componente base (renderização, estados, a11y) | Apenas 2 testes (`StatusChip` e `ThemeToggle`); 0 testes para Button, Card, Dialog, ConfirmDialog, Field, Toast, Skeleton | **Reprovado** |
| **T080** | formatarMoeda e mensagens de erro em pt-BR com testes | `formato.js` e `erros.js` criados, porém mensagens de erro não integradas totalmente aos fluxos | **Parcial** |
| **T081** | Saldo total calculado a partir de GET /api/contas em BRL | Calculado e exibido na Visão Geral | **Aprovado** |
| **T081** | Contagens de ativos/inativos corretas (testes com MSW) | Lógica presente, mas faltam testes unitários/integração com MSW para `VisaoGeral.jsx` | **Reprovado** |
| **T081** | Estados de carregamento (Skeleton) e vazio (EmptyState) | Presentes no código da Visão Geral | **Aprovado** |
| **T082** | Grade de cartões para contas (container queries 1→2→3 cols) | `ListaContas.jsx` usa lista vertical comum (`ul.data-list`) com hack de span oculto; botões nativos cinzas | **Reprovado** |
| **T082** | Nova conta e consulta em Dialog nativo com foco preso/devolvido | Formulários continuam colados na página principal de `Contas.jsx`, fora de `<Dialog>` | **Reprovado** |
| **T082** | Transferência obrigatória em 3 passos (Formulário → Revisão → Recibo com saldos) | Implementado como fallback condicional (`moderno=false` por padrão com envio direto legado) | **Reprovado** |
| **T082** | Mapeamento de erros da API em pt-BR com caminho de correção | Não integrado com clareza no passo de revisão | **Reprovado** |
| **T083** | Clientes em tabela (desktop) e cartões (mobile < 960px) | Mobile apenas esconde colunas da tabela (`display: none`); não renderiza cartões | **Reprovado** |
| **T083** | Novo cliente em Dialog com validação inline de idade (18–65) | Renderizado diretamente na tela, sem Dialog, sem validação inline no formulário | **Reprovado** |
| **T083** | Ações de clientes padronizadas com chips e botões estilizados | `AcoesCliente.jsx` usa `<button>` HTML nativo cinza | **Reprovado** |
| **T084** | Alvos ≥ 44px, focus-visible, skip-link, sem rolagem horizontal | Skip-link com problemas de sobreposição no mobile; forms com labels colados | **Reprovado** |
| **T084** | E2E do fluxo completo (criar conta, criar cliente, transferir com revisão e recibo) 2x seguidas | Teste E2E atual utiliza o formulário legado direto, sem passar pelos passos de revisão e recibo | **Reprovado** |
| **T084** | Capturas de tela (claro/escuro, 1280px e 390px) em `frontend/e2e/screenshots/` | Faltam todas as capturas do tema claro para Contas, Clientes e Transferir; falta o recibo em ambos os temas | **Reprovado** |

---

## 3. Lista de Bloqueantes para a Rodada 2

### Bloqueante B01: Código minificado e aglomeração de regras (ADR-017 / Clean Code)
- **Localização:** `frontend/src/styles/app.css` (linhas 7–21), `tokens.css`, `Field.jsx` (l. 3), `ListaClientes.jsx` (l. 12), `Transferencia.jsx` (l. 38, 39, 41), `VisaoGeral.jsx` (l. 23–29).
- **Problema:** Diversas regras CSS e blocos JSX foram comprimidos em linhas únicas de centenas de caracteres, violando a regra de legibilidade, clean code e manutenibilidade do projeto.
- **Ação requerida:** Formatar adequadamente o CSS (uma declaração/regra por bloco, com indentação padrão) e os componentes JSX em linhas legíveis e modularizadas.

### Bloqueante B02: Contas sem grade de cartões e uso de botões cinzas nativos (§4, §5)
- **Localização:** `frontend/src/features/contas/ListaContas.jsx`, `frontend/src/features/clientes/AcoesCliente.jsx`, `CadastroConta.jsx`, `CadastroCliente.jsx`, `ConsultaConta.jsx`, `ConsultaCliente.jsx`.
- **Problema:**
  - `ListaContas.jsx` exibe uma lista flexível comum (`.data-list`), não uma grade de cartões responsiva (1→2→3 colunas) conforme especificado em `docs/design-frontend.md §4`.
  - Os botões de ação ("Ativar conta", "Desativar conta", "Ver situação", "Remover conta") utilizam `<button>` nativo sem classes nem estilização, resultando em retângulos cinzas de navegador.
  - Foi introduzido um elemento hacky oculto: `<span className="muted">Conta {conta.id}: {conta.saldo}</span>` unicamente para burlar asserções de testes antigos sem refatoração limpa.
- **Ação requerida:** Implementar grade de cartões responsiva usando `<Card>`, aplicar `<Button variant="...">` em todas as ações, e remover hacks de texto duplicado oculto ajustando os testes adequadamente.

### Bloqueante B03: Fluxo de transferência em 3 passos mandatório (§4, T082)
- **Localização:** `frontend/src/features/contas/Transferencia.jsx` e `frontend/src/App.jsx`.
- **Problema:**
  - `Transferencia.jsx` possui uma prop `moderno=false` por padrão. Quando o usuário clica em submeter, a função `enviarLegado` despacha a requisição diretamente sem revisão nem recibo.
  - O botão "Revisar antes de transferir" e os selects estilizados só aparecem se `moderno=true`.
  - A rota de navegação "Transferir" em `App.jsx` apenas monta `<Contas moderno />`, fazendo com que a tela de transferência seja uma cópia inteira da tela de Contas (com busca, cadastro e lista duplicados) em vez de uma tela focada na operação.
- **Ação requerida:** Tornar o fluxo de 3 passos o fluxo oficial e padrão:
  1. Formulário (origem e destino com `<select>` exibindo número e saldo, valor com prefixo R$, validação inline);
  2. Revisão (resumo claro "De → Para", "Valor", "Saldo da origem depois", botões "Voltar" e "Confirmar");
  3. Recibo (confirmação com saldos atualizados, data/hora e ação "Nova transferência").
  - Criar tela/seção dedicada para Transferir na navegação do App Shell.

### Bloqueante B04: Formulários de Nova Conta e Novo Cliente fora de `<Dialog>` (§4, T082, T083)
- **Localização:** `frontend/src/features/contas/Contas.jsx` e `frontend/src/features/clientes/Clientes.jsx`.
- **Problema:** A especificação exige que "Nova conta" e "Novo cliente" sejam acionados por botões na barra de ferramentas e abram em modais nativos (`<dialog>`), mantendo a tela limpa e focada. Atualmente os formulários estão colados permanentemente na página.
- **Ação requerida:** Encapsular `CadastroConta` e `CadastroCliente` dentro do componente `<Dialog>` nativo, com foco preso e devolvido ao fechar.

### Bloqueante B05: Lista de clientes no mobile sem cartões e alinhamento incorreto (§4, §6)
- **Localização:** `frontend/src/features/clientes/ListaClientes.jsx` e `frontend/src/styles/app.css`.
- **Problema:**
  - Em telas menores (<960px), a tabela simplesmente oculta a coluna de e-mail com `display: none`, violando o requisito de exibir cartões responsivos no mobile.
  - A coluna "Idade" foi formatada com alinhamento à direita e `tabular-nums` de moeda devido à regra genérica `td:nth-child(3)`.
- **Ação requerida:** Criar visualização responsiva de cartões de clientes para telas mobile e corrigir o alinhamento das colunas da tabela no desktop.

### Bloqueante B06: Formulários desalinhados, labels grudados e ausência de `<Field>` (§5, §7)
- **Localização:** Formulários de cadastro e consulta em `contas` e `clientes`.
- **Problema:**
  - O componente `<Field>` foi criado mas nunca utilizado no código do aplicativo.
  - Os formulários usam `<label>` contendo `<input>` no mesmo fluxo inline/flex, gerando labels colados nos campos e desalinhamento visual.
  - Falta validação inline de idade (18–65 anos) imediata no formulário de cliente conforme exigido no §4 e T083.
- **Ação requerida:** Refatorar os formulários para utilizar o componente `<Field>` com labels associados, espaçamento adequado dos tokens e mensagens de ajuda/erro vinculadas por `aria-describedby` e `aria-invalid`. Adicionar validação inline da faixa 18–65 no campo de idade.

### Bloqueante B07: Componentes base ausentes e cobertura de testes inaceitável (§5, T080)
- **Localização:** `frontend/src/components/` e `frontend/src/components/base.test.jsx`.
- **Problema:**
  - Os componentes base `Select.jsx` e `Icon.jsx` (com SVGs inline próprios sem dependência externa) não foram criados.
  - `base.test.jsx` possui apenas 2 testes (`StatusChip` e `ThemeToggle`), ignorando completamente `Button`, `Card`, `StatCard`, `Field`, `Dialog`, `ConfirmDialog`, `Toast`, `EmptyState`, `Skeleton`.
  - Foram adicionados apenas 3 testes em todo o frontend (de 26 para 29 testes), sem cobrir o comportamento dos novos componentes nem a Visão Geral.
- **Ação requerida:** Criar os componentes `Select.jsx` e `Icon.jsx`, e implementar testes unitários e de acessibilidade completos para cada componente base.

### Bloqueante B08: Capturas de tela ausentes no Playwright (§8, T084)
- **Localização:** `frontend/e2e/screenshots/` e `frontend/e2e/fluxo-bancario.spec.js`.
- **Problema:**
  - O script de screenshot em `fluxo-bancario.spec.js` alterna para o tema escuro no início e captura apenas as telas escuras de Contas, Clientes e Transferir.
  - Faltam as capturas em **tema claro** (1280px e 390px) para: Contas, Clientes, Transferir (formulário), Transferir (revisão) e Transferir (recibo).
  - Faltam as capturas do **Recibo** de transferência em ambos os temas (claro e escuro, 1280px e 390px).
- **Ação requerida:** Atualizar o teste Playwright para gerar a matriz completa de capturas exigida pelo critério de aceite de T084.

### Bloqueante B09: Teste E2E não valida o fluxo de 3 passos da transferência (T084)
- **Localização:** `frontend/e2e/fluxo-bancario.spec.js`.
- **Problema:** O teste principal do fluxo bancário continua preenchendo o formulário legado e clicando direto em "Transferir", sem passar pelos passos de revisão e recibo.
- **Ação requerida:** Atualizar o teste E2E para exercitar o fluxo ponta a ponta: preenchimento -> revisão -> confirmação -> visualização do recibo com saldos atualizados.

### Bloqueante B10: Avisos de runtime React e skip-link no mobile (§3, §7)
- **Localização:** `frontend/src/App.jsx` e testes.
- **Problema:**
  - `App.jsx` repassa `key` dentro de objeto spread (`let props = { key, ... }`), disparando warning do React no console/testes.
  - O teste de `ThemeToggle` dispara aviso de atualização de estado fora de `act(...)`.
  - O `.skip-link` precisa garantir que não apareça sobreposto ou corte elementos no viewport móvel de 390px.
- **Ação requerida:** Corrigir os warnings de React e assegurar a exibição limpa e acessível do skip-link apenas sob foco.

---

## 4. Instruções para a Rodada 2

1. **Desenvolvimento TDD:** Adicionar os testes unitários faltantes para os componentes base, tela de Visão Geral e fluxo de transferência antes ou junto às implementações.
2. **Revisão Visual:** Certificar-se de inspecionar as telas geradas contra os protótipos e diretrizes de `docs/design-frontend.md`.
3. **Execução Completa:** Após implementar as correções, rodar:
   - `npm test` (vitest verde sem warnings de act ou key);
   - `npm run build`;
   - `docker compose up -d --build`;
   - `npm run e2e` (2 vezes consecutivas com persistência do volume);
   - Gerar todas as capturas em `frontend/e2e/screenshots/`.
4. Enviar nova notificação `ORCA/REVIEW_RESPONSE + REVIEW_REQUEST` ao término.
