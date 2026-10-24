# Design do frontend (P008 — redesign)

Objetivo: deixar a interface **moderna, calma e confiável**, no padrão de produtos financeiros atuais
(Mercury, Stripe, Wise), sem perder nenhuma operação nem a acessibilidade. Base da pesquisa em §9.

## 1. Princípios

1. **Clareza antes de decoração.** Finanças precisam de decisões rápidas: hierarquia forte, pouco ruído, sem gradientes nas áreas de dados.
2. **Cor significa estado.** Paleta neutra; verde/vermelho/âmbar só para estado (ativa/inativa, sucesso/erro), **sempre acompanhados de ícone e texto** (nunca só cor).
3. **Números em primeiro plano.** Saldos são o maior texto da tela, em algarismos tabulares e moeda formatada.
4. **Prevenir erro na transferência.** Revisão antes de confirmar, recibo depois.
5. **Acessível por padrão (WCAG 2.2 AA).**

## 2. Tokens de design (`src/styles/tokens.css`)

Componentes usam **só tokens semânticos**, nunca cores cruas.

| Grupo | Tokens (exemplos) |
|---|---|
| Superfícies | `--bg`, `--surface`, `--surface-2`, `--border`, `--overlay` |
| Texto | `--text`, `--text-muted`, `--text-on-accent` |
| Marca | `--accent` (azul-índigo), `--accent-hover`, `--focus-ring` |
| Estado | `--success`, `--success-bg`, `--danger`, `--danger-bg`, `--warning`, `--warning-bg`, `--info`, `--info-bg` |
| Tipografia | `--font-sans` (pilha de sistema: `Inter, ui-sans-serif, system-ui, …` sem baixar fonte), escala `--fs-xs … --fs-3xl` |
| Espaço / raio / sombra | `--space-1 … --space-8` (base 4px), `--radius-sm/md/lg/full`, `--shadow-sm/md` |
| Movimento | `--ease`, `--dur-fast` (120ms), `--dur` (200ms); zerados em `prefers-reduced-motion` |

- **Tema claro e escuro**: `color-scheme: light dark` + `light-dark()` nos tokens de cor, com override por
  `[data-theme="light"|"dark"]` no `<html>`. Botão de tema no cabeçalho; escolha salva em `localStorage`
  (dentro de `try/catch`); padrão = preferência do sistema.
- Contraste mínimo 4.5:1 para texto e 3:1 para bordas de controles e ícones, nos dois temas.

## 3. Estrutura (app shell)

```text
┌────────────┬──────────────────────────────────────────────┐
│  Logo      │  Título da seção            [tema] [+ ação]  │
│            ├──────────────────────────────────────────────┤
│ ▸ Visão    │                                              │
│   geral    │   conteúdo da seção                          │
│ ▸ Contas   │                                              │
│ ▸ Clientes │                                              │
│ ▸ Transfe- │                                              │
│   rir      │                                              │
└────────────┴──────────────────────────────────────────────┘
```

- Desktop (≥ 960px): barra lateral fixa à esquerda com navegação (`<nav aria-label="Navegação principal">`, item atual com `aria-current="page"`).
- Mobile (< 960px): cabeçalho no topo e navegação em barra inferior com ícone + rótulo; nada fixo pode cobrir o foco (WCAG 2.4.11).
- Seções: **Visão geral**, **Contas**, **Clientes**, **Transferir**. Navegação por estado (sem router novo).
- `<main>` com um `<h1>` por seção; "pular para o conteúdo" no início.

## 4. Telas

### Visão geral
- **Saldo total** (soma das contas ativas) em destaque, com o número de contas ativas/inativas.
- Cartões-resumo: clientes ativos/inativos, contas ativas/inativas.
- Atalhos: "Nova transferência", "Nova conta", "Novo cliente".
- Lista curta das contas com maior saldo.

### Contas
- **Grade de cartões** (container queries: 1→2→3 colunas): número da conta, saldo grande, chip de situação, menu de ações (ativar/desativar/situação/remover).
- Barra superior: busca por id (consulta) e botão "Nova conta" que abre o formulário em **painel/dialog** (`<dialog>` nativo, foco preso e devolvido).

### Clientes
- **Tabela** (desktop) / lista de cartões (mobile): nome, e-mail, idade, conta vinculada, chip de situação, ações.
- "Novo cliente" em dialog; o campo idade mostra na hora se está entre 18 e 65 (validação de idade integrada, além do botão "Validar idade").
- Busca por id.

### Transferir (fluxo em 3 passos)
1. **Formulário**: origem e destino como `<select>` das contas (mostrando número e saldo), valor com prefixo "R$"; validação inline (valor > 0, origem ≠ destino, saldo suficiente — o backend continua sendo a fonte da verdade).
2. **Revisão**: resumo "De → Para, Valor, saldo da origem depois" com botões "Voltar" e "Confirmar transferência".
3. **Recibo**: sucesso com saldos atualizados de origem e destino, data/hora, e "Nova transferência". Erros da API aparecem no passo de revisão com a mensagem e um caminho de correção.

## 5. Componentes (`src/components/`)

`Button` (primária, secundária, perigo, fantasma; estado carregando), `Card`, `StatCard`, `Badge`/`StatusChip`
(ícone + texto), `Field` (label, dica, erro ligado por `aria-describedby`, `aria-invalid`), `Select`, `Dialog`,
`ConfirmDialog` (para **remover** cliente/conta), `Toast` (substitui `Mensagem`: sucesso em `role="status"`,
erro em `role="alert"`), `EmptyState`, `Skeleton`, `Icon` (SVGs inline próprios; **sem biblioteca de ícones**).
Um componente por arquivo, com o seu CSS (`*.module.css` ou CSS por componente).

## 6. Formatação

- Moeda: `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` em `src/lib/formato.js`, usada em **todo** lugar que exibe saldo.
- `font-variant-numeric: tabular-nums` em saldos e tabelas; números alinhados à direita nas tabelas.
- Mensagens de erro: mapear o código `erro` da API para texto em português com acento (`src/lib/erros.js`), com o texto do backend como fallback.

## 7. Acessibilidade e responsividade (critérios de aceite)

- Alvos clicáveis ≥ 44×44px (acima do mínimo de 24px da WCAG 2.5.8).
- `:focus-visible` com anel de 2px em `--focus-ring` e contraste 3:1.
- Todos os campos com `<label>`; erros associados por `aria-describedby`.
- Status nunca só por cor.
- Funciona a 320px de largura sem rolagem horizontal; até 200% de zoom.
- `prefers-reduced-motion` desliga animações.

## 8. Restrições

- **Sem novas dependências de runtime** (nada de UI kit, CSS framework, biblioteca de ícones ou fonte baixada). Tudo com CSS moderno e React.
- Manter a API e os formatos de `docs/api.md`.
- Os 26 testes de comportamento continuam cobrindo as mesmas operações (ajustar seletores se a estrutura mudar, sem remover casos); novos testes para os componentes e para o fluxo de transferência em 3 passos.
- E2E Playwright atualizado para o novo fluxo e com **capturas de tela** (claro/escuro, 1280px e 390px) em `frontend/e2e/screenshots/` para a revisão visual.
- Clean code: ADR-017 (um componente por responsabilidade, arquivos pequenos, versões exatas).

## 9. Fontes da pesquisa (2026-10-23)

- AdminLTE — fintech dashboard design examples (Mercury, Stripe, Wise, Ramp): https://adminlte.io/blog/fintech-dashboard-design-examples/
- Lollypop — banking app UI design (fluxo de transferência, confirmação, recibo, status): https://lollypop.design/blog/2026/june/banking-app-ui-design/
- Veza Digital — fintech web design trends 2026: https://vezadigital.com/post/fintech-web-design-trends
- W3C — What's new in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Una Kravets — modern CSS theming (`light-dark()`): https://una.im/modern-css-theming

---

## 10. Divergências e Decisões de Implementação Aprovadas

1. **Ações secundárias com botões fantasma (`variant="ghost"`):** Em vez de menus dropdown suspensos para ações de conta e cliente (ativar, desativar, situação e remover), a implementação adotou botões compactos na variante fantasma e perigo diretamente na linha da tabela e no rodapé dos cartões. Isso eliminou a complexidade de armadilhas de foco (*focus trapping*) em menus flutuantes e manteve o acesso direto em um clique com total aderência a alvos acessíveis.
2. **Estilização com CSS coeso em vez de `*.module.css`:** Os estilos foram organizados em arquivos temáticos bem definidos (`src/styles/tokens.css`, `forms.css`, `components.css` e `app.css`) em vez de múltiplos arquivos CSS modulares por componente, facilitando a governança de tokens e a manutenibilidade.
3. **Coexistência de `Mensagem.jsx` e `Toast.jsx`:** O componente `Mensagem.jsx` foi mantido em paralelo ao `Toast.jsx` para garantir compatibilidade retroativa e estabilidade nos testes de componentes.
