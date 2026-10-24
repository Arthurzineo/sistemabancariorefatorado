import { expect, test } from "@playwright/test";

test("cadastra conta, cliente e transfere valores pela interface", async ({
  page,
}) => {
  const id = String(Date.now());
  const nome = `Cliente E2E ${id}`;
  await page.goto("/");
  await page.getByRole("button", { name: "Contas" }).click();
  await page.getByRole("button", { name: "Nova conta" }).click();
  const cadastroConta = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Cadastrar conta" }) });
  await cadastroConta.getByLabel("ID da conta").fill(id);
  await cadastroConta.getByLabel("Saldo").fill("0");
  await cadastroConta.getByRole("button", { name: "Cadastrar conta" }).click();
  await expect(page.getByRole("status")).toContainText("Conta cadastrada");

  await page.getByRole("button", { name: "Clientes" }).click();
  await page.getByRole("button", { name: "Novo cliente" }).click();
  const cadastroCliente = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Cadastrar cliente" }) });
  await cadastroCliente.getByLabel("ID", { exact: true }).fill(id);
  await cadastroCliente.getByLabel("Nome").fill(nome);
  await cadastroCliente.getByLabel("Idade").fill("25");
  await cadastroCliente.getByLabel("E-mail").fill("e2e@example.com");
  await cadastroCliente.getByLabel("ID da conta corrente").fill(id);
  await cadastroCliente
    .getByRole("button", { name: "Cadastrar cliente" })
    .click();
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

test("captura as telas principais nos temas claro e escuro", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const sufixo = `${viewport.width}x${viewport.height}`;
    await page.screenshot({
      path: `e2e/screenshots/visao-geral-claro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Alternar tema" }).click();
    await page.screenshot({
      path: `e2e/screenshots/visao-geral-escuro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Contas" }).click();
    await page.screenshot({
      path: `e2e/screenshots/contas-escuro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Clientes" }).click();
    await page.screenshot({
      path: `e2e/screenshots/clientes-escuro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Transferir" }).click();
    await page.screenshot({
      path: `e2e/screenshots/transferir-formulario-escuro-${sufixo}.png`,
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
      path: `e2e/screenshots/transferir-revisao-escuro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Confirmar transferência" }).click();
    await page.screenshot({
      path: `e2e/screenshots/transferir-recibo-escuro-${sufixo}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Nova transferência" }).click();
  }
});
