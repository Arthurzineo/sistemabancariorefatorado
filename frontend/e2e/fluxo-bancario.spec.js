import { expect, test } from "@playwright/test";

test("cadastra conta, cliente e transfere valores pela interface", async ({
  page,
}) => {
  const id = String(900 + (Date.now() % 1000));
  await page.goto("/");
  await page.getByRole("button", { name: "Contas" }).click();
  await page.getByRole("button", { name: "Nova conta" }).click();
  const conta = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Cadastrar conta" }) });
  await conta.getByLabel("ID da conta").fill(id);
  await conta.getByLabel("Saldo").fill("0");
  await conta.getByRole("button", { name: "Cadastrar conta" }).click();
  await expect(page.getByRole("status")).toContainText("Conta cadastrada");
  await page.getByRole("button", { name: "Clientes" }).click();
  await page.getByRole("button", { name: "Novo cliente" }).click();
  const cliente = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Cadastrar cliente" }) });
  await cliente.getByLabel("ID", { exact: true }).fill(id);
  await cliente.getByLabel("Nome").fill(`Cliente E2E ${id}`);
  await cliente.getByLabel("Idade").fill("25");
  await cliente.getByLabel("E-mail").fill("e2e@example.com");
  await cliente.getByLabel("ID da conta corrente").fill(id);
  await cliente.getByRole("button", { name: "Cadastrar cliente" }).click();
  await expect(page.getByRole("status")).toContainText("Cliente cadastrado");
  await page.getByRole("button", { name: "Transferir" }).click();
  const transferencia = page.locator("form.transfer-step");
  await transferencia.getByLabel("Conta de origem").selectOption("1");
  await transferencia.getByLabel("Conta de destino").selectOption(id);
  await transferencia.getByLabel("Valor").fill("10");
  await transferencia
    .getByRole("button", { name: "Revisar antes de transferir" })
    .click();
  await page.getByRole("button", { name: "Confirmar transferência" }).click();
  await expect(page.getByRole("status")).toContainText("recibo");
});

test("captura todas as telas nos temas claro e escuro", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    const sufixo = `${viewport.width}x${viewport.height}`;
    async function capturar(tema) {
      await page.goto("/");
      await page.screenshot({
        path: `e2e/screenshots/visao-geral-${tema}-${sufixo}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Contas" }).click();
      await expect(page.getByText("Conta 1", { exact: true })).toBeVisible();
      await page.screenshot({
        path: `e2e/screenshots/contas-${tema}-${sufixo}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Clientes" }).click();
      await expect(page.getByText("Maria Silva")).toBeVisible();
      await page.screenshot({
        path: `e2e/screenshots/clientes-${tema}-${sufixo}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Transferir" }).click();
      await expect(page.getByText("Passo 1 de 3")).toBeVisible();
      await page.screenshot({
        path: `e2e/screenshots/transferir-formulario-${tema}-${sufixo}.png`,
        fullPage: true,
      });
      await page
        .getByRole("combobox", { name: "Conta de origem" })
        .selectOption("1");
      await page
        .getByRole("combobox", { name: "Conta de destino" })
        .selectOption("2");
      await page.locator('input[name="valor"]').fill("1");
      await page
        .getByRole("button", { name: "Revisar antes de transferir" })
        .click();
      await page.screenshot({
        path: `e2e/screenshots/transferir-revisao-${tema}-${sufixo}.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Confirmar transferência" })
        .click();
      await expect(page.getByText("Passo 3 de 3")).toBeVisible();
      await page.screenshot({
        path: `e2e/screenshots/transferir-recibo-${tema}-${sufixo}.png`,
        fullPage: true,
      });
    }
    await capturar("claro");
    await page.getByRole("button", { name: "Alternar tema" }).click();
    await capturar("escuro");
  }
});
