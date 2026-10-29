# Relatório de Revisão — Fase P008 (PR #8, Rodada 2)

- **Data:** 2026-10-23
- **Revisor:** agy (role: tester-reviewer, contrato C-20261023-005)
- **Autor da Entrega:** codex (contrato C-20261023-004)
- **Alvo:** PR #8 (`codex/p008-redesign-frontend` -> `main`, commit `c62208d`)
- **Escopo:** Avaliação da reestruturação visual, acessibilidade e remediação da Rodada 1
- **Resultado:** `changes_requested`

---

## 1. Veredito e Resumo Executivo

O commit `c62208d` representou uma grande evolução estrutural e visual:
- O CSS foi reorganizado e quebrado em módulos formatados (`tokens.css`, `app.css`, `components.css`, `forms.css`), eliminando as linhas minificadas apontadas no Bloqueante B01;
- Foram introduzidos os componentes base `Button.jsx`, `Field.jsx`, `Select.jsx` e `Icon.jsx` com SVGs inline sem dependências externas;
- A tela de Contas recebeu visual em grade de cartões (`.account-grid`), dialog nativo para criação de conta e remoção da transferência embutida;
- A operação de transferência ganhou tela própria (`TransferenciaPage.jsx`) com fluxo em 3 passos estruturados (Formulário → Revisão → Recibo);
- A tela de Clientes recebeu `<Dialog>` nativo para novo cadastro e estados de carregamento e vazio (`Skeleton`, `EmptyState`).

Contudo, a refatoração introduziu **regressões severas de testes unitários**, um **defeito lógico visível na interface de contas**, e **problemas na geração das evidências visuais (capturas E2E)**:
1. **14 testes quebrados no Vitest (`npx vitest run`)**: A reestruturação de telas e remoção de elementos sem a devida atualização dos testes existentes quebrou 8 testes em `tests/app.test.jsx` e 6 em `src/features/contas/componentes.test.jsx`.
2. **Lógica invertida no botão de contas**: A comparação `conta.situacao === "ATIVA"` é sensível a maiúsculas. Como a API devolve `"Ativa"`, contas ativas exibem o botão "Ativar".
3. **Capturas E2E defeituosas e incompletas**: A lista de clientes foi capturada exibindo o `Skeleton` (captura tirada antes do carregamento); a captura do recibo registrou a tela de revisão (Passo 2); e as capturas no **tema claro** continuam ausentes para quase todas as telas.

O veredito permanece **CHANGES_REQUESTED**, com 6 bloqueantes imediatos para a Rodada 3.

---

## 2. Status dos Bloqueantes da Rodada 1

| ID Rodada 1 | Descrição Resumida | Situação na Rodada 2 |
|---|---|---|
| **B01** | Código minificado em CSS/JSX | **Resolvido**: CSS dividido em arquivos modularizados e código formatado com Prettier |
| **B02** | Contas sem cartões e botões nativos cinzas | **Parcial**: Cartões e Button aplicados, mas botão "Ativar" com lógica invertida |
| **B03** | Transferência em 3 passos mandatório | **Resolvido**: `TransferenciaPage.jsx` e fluxo de 3 passos implementados na rota principal |
| **B04** | Nova conta e Novo cliente em `<Dialog>` | **Resolvido**: Ambos os formulários agora abrem em `<Dialog>` nativo |
| **B05** | Clientes mobile em cartões e alinhamento | **Resolvido**: `ListaClientes.jsx` adaptado com tabela desktop e cards mobile |
| **B06** | Formulários desalinhados e sem `<Field>` | **Resolvido**: `<Field>` e `<Select>` integrados aos formulários |
| **B07** | Falta de `Select`, `Icon` e testes base | **Parcial**: `Select` e `Icon` criados; `a11y.test.jsx` adicionado; mas 14 testes da suite quebraram |
| **B08** | Capturas de tela ausentes (tema claro e recibo) | **Não resolvido**: Tema claro continua sem capturas; recibo gravou passo 2; clientes gravou Skeleton |
| **B09** | Teste E2E sem fluxo de 3 passos | **Resolvido**: `fluxo-bancario.spec.js` atualizado para testar os 3 passos |
| **B10** | Warning de React key spread e skip-link | **Resolvido**: Key spread removido; skip-link revisado |

---

## 3. Lista de Bloqueantes da Rodada 2

### Bloqueante R2-B01: 14 testes falhando no Vitest (`npx vitest run`)
- **Evidência Comprobatória:**
  ```text
  Test Files  2 failed | 4 passed (6)
  Tests       14 failed | 18 passed (32)
  FAIL tests/app.test.jsx (8 testes falhando)
  FAIL src/features/contas/componentes.test.jsx (6 testes falhando)
  ```
- **Detalhes das Falhas:**
  - `tests/app.test.jsx`:
    1. O teste de navegação falha ao procurar pelo heading `/contas correntes/i` (o novo título da seção é `Contas`).
    2. Os 7 testes de transferência (fluxo de erro da API) clicam na aba `Contas` e tentam localizar `getByLabelText("Conta de origem")`, mas a transferência foi transferida para a aba `Transferir` e os campos agora são seletores combobox (`Select`).
  - `src/features/contas/componentes.test.jsx`:
    1. Falhas em asserções que procuram por botões com nome "Ativar conta", "Desativar conta" e heading "Transferir valores" diretamente no componente de Contas.
- **Ação requerida:** Atualizar as asserções e seletores dos testes legados em `tests/app.test.jsx` e `src/features/contas/componentes.test.jsx` para refletir as novas rotas e componentes sem remover nenhum cenário de negócio (conforme exigido em `docs/design-frontend.md §8`). Todos os 32+ testes devem passar (`0 failed`).

### Bloqueante R2-B02: Lógica invertida no botão Ativar/Desativar de `ListaContas.jsx`
- **Localização:** `frontend/src/features/contas/ListaContas.jsx` (linhas 26 e 30).
- **Código Atual:**
  ```jsx
  <Button
    variant="ghost"
    onClick={() =>
      onAcao(
        conta.id,
        conta.situacao === "ATIVA" ? "desativar" : "ativar",
      )
    }
  >
    {conta.situacao === "ATIVA" ? "Desativar" : "Ativar"}
  </Button>
  ```
- **Problema:** A comparação estrita com `"ATIVA"` falha porque os dados retornados pela API e mocks utilizam `"Ativa"` (PascalCase). Em consequência, todas as contas ativas exibem o rótulo "Ativar" e enviam a ação redundante `"ativar"`.
- **Ação requerida:** Utilizar verificação case-insensitive, ex.: `/ativa/i.test(conta.situacao)`.

### Bloqueante R2-B03: Captura de tela da lista de clientes presa no `<Skeleton>`
- **Localização:** `frontend/e2e/fluxo-bancario.spec.js` e capturas `clientes-escuro-*.png`.
- **Problema:** A captura de tela da seção de clientes é tirada imediatamente após clicar no botão da navegação (`await page.getByRole("button", { name: "Clientes" }).click()`), antes de os dados da API serem carregados. O screenshot resultante exibe apenas o bloco de carregamento (`Skeleton`), ocultando a visualização da tabela e dos chips de clientes.
- **Ação requerida:** No teste Playwright, aguardar explicitamente os dados do cliente estarem visíveis (ex.: `await expect(page.getByRole("table")).toBeVisible()` ou checar por um cliente na lista) antes de invocar `page.screenshot`.

### Bloqueante R2-B04: Captura do recibo de transferência registrando o Passo 2 (Revisão)
- **Localização:** `frontend/e2e/fluxo-bancario.spec.js` e capturas `transferir-recibo-escuro-*.png`.
- **Problema:** O screenshot de recibo foi tirado imediatamente após clicar em "Confirmar transferência" sem aguardar a conclusão da requisição da API e a transição para a tela de recibo (Passo 3). A imagem capturada exibe a tela de revisão (Passo 2) com os botões "Voltar" e "Confirmar".
- **Ação requerida:** Aguardar a tela de recibo estar montada e visível (`await expect(page.getByRole("heading", { name: /transferência concluída/i })).toBeVisible()`) antes de tirar o screenshot de recibo.

### Bloqueante R2-B05: Matriz de capturas em tema claro ausente (§8, T084)
- **Localização:** `frontend/e2e/fluxo-bancario.spec.js` e diretório `frontend/e2e/screenshots/`.
- **Problema:** O teste de capturas continua alternando imediatamente para o tema escuro após a Visão Geral, gerando screenshots escuros para as demais telas. Faltam completamente as capturas no **tema claro** (1280px e 390px) para:
  1. Contas (`contas-claro-1280x900.png` e `contas-claro-390x844.png`)
  2. Clientes (`clientes-claro-1280x900.png` e `clientes-claro-390x844.png`)
  3. Transferir — Formulário (`transferir-formulario-claro-1280x900.png` e `transferir-formulario-claro-390x844.png`)
  4. Transferir — Revisão (`transferir-revisao-claro-1280x900.png` e `transferir-revisao-claro-390x844.png`)
  5. Transferir — Recibo (`transferir-recibo-claro-1280x900.png` e `transferir-recibo-claro-390x844.png`)
- **Ação requerida:** Garantir a cobertura completa 100% de capturas tanto em tema claro quanto em tema escuro para todos os 5 estados especificados em T084 em ambos os viewports.

### Bloqueante R2-B06: Warning de act(...) persistente no teste de ThemeToggle
- **Localização:** `frontend/src/components/base.test.jsx`.
- **Problema:** Dispara `stderr | An update to ThemeToggle inside a test was not wrapped in act(...)`.
- **Ação requerida:** Usar `userEvent` ou envolver a interação em `act(...)` conforme boas práticas do React Testing Library.

---

## 4. Instruções para a Rodada 3

1. Corrigir a comparação de `conta.situacao` em `ListaContas.jsx`.
2. Atualizar os seletores e rotas em `tests/app.test.jsx` e `src/features/contas/componentes.test.jsx`.
3. Executar localmente `npx vitest run` e assegurar que todos os testes passem (0 falhas).
4. Corrigir os asserts de espera no Playwright em `fluxo-bancario.spec.js` para garantir que Clientes e Recibo sejam capturados em estado pronto.
5. Capturar o conjunto completo de telas em tema claro e escuro a 1280px e 390px.
6. Rodar o build e o E2E 2x seguidas no volume persistente antes de solicitar a Rodada 3.
