import { expect, test } from '@playwright/test'

test('cadastra conta, cliente e transfere valores pela interface', async ({ page }) => {
  const id = String(Date.now()).slice(-7)
  const nome = `Cliente E2E ${id}`
  await page.goto('/')
  await page.getByRole('button', { name: 'Contas' }).click()
  const cadastroConta = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Cadastrar conta' }) })
  await cadastroConta.getByLabel('ID da conta').fill(id)
  await cadastroConta.getByLabel('Saldo').fill('0')
  await cadastroConta.getByRole('button', { name: 'Cadastrar conta' }).click()
  await expect(page.getByRole('status')).toContainText('Conta cadastrada')

  await page.getByRole('button', { name: 'Clientes' }).click()
  const cadastroCliente = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Cadastrar cliente' }) })
  await cadastroCliente.getByLabel('ID', { exact: true }).fill(id)
  await cadastroCliente.getByLabel('Nome').fill(nome)
  await cadastroCliente.getByLabel('Idade').fill('25')
  await cadastroCliente.getByLabel('E-mail').fill('e2e@example.com')
  await cadastroCliente.getByLabel('ID da conta corrente').fill(id)
  await cadastroCliente.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page.getByRole('status')).toContainText('Cliente cadastrado')

  await page.getByRole('button', { name: 'Contas' }).click()
  const transferencia = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Transferir valores' }) })
  await transferencia.getByLabel('Conta de origem').fill('1')
  await transferencia.getByLabel('Conta de destino').fill(id)
  await transferencia.getByLabel('Valor').fill('10')
  await transferencia.getByRole('button', { name: 'Transferir' }).click()
  await expect(page.getByRole('status')).toContainText('Transferência realizada')
  await expect(page.getByText(new RegExp(`Conta ${id}: 10`))).toBeVisible()
})
