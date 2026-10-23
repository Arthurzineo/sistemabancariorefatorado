import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import App from '../src/App.jsx'
import { server } from './server.js'

describe('Sistema Bancário', () => {
  it('navega entre clientes e contas com controles acessíveis', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: /sistema bancário/i })).toBeInTheDocument()
    expect(await screen.findByText('Ana')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /contas/i }))
    expect(screen.getByRole('heading', { name: /contas correntes/i })).toBeInTheDocument()
  })

  it('mostra a mensagem devolvida pela API ao falhar transferência', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^contas$/i }))
    await user.type(screen.getByLabelText('Conta de origem'), '1')
    await user.type(screen.getByLabelText('Conta de destino'), '2')
    await user.type(screen.getByLabelText('Valor'), '500')
    await user.click(screen.getByRole('button', { name: /^transferir$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Saldo insuficiente na conta de origem.')
  })

  it.each([
    ['saldo_insuficiente', 'Saldo insuficiente na conta de origem.'],
    ['valor_invalido', 'Valor de transferência inválido.'],
    ['conta_origem_nao_encontrada', 'Conta de origem não encontrada.'],
    ['conta_destino_nao_encontrada', 'Conta de destino não encontrada.'],
    ['conta_origem_inativa', 'Conta de origem inativa.'],
    ['conta_destino_inativa', 'Conta de destino inativa.'],
  ])('exibe a mensagem de erro %s da API', async (_codigo, mensagem) => {
    server.use(http.post('/api/transferencias', () => HttpResponse.json({ erro: _codigo, mensagem }, { status: 422 })))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^contas$/i }))
    await user.type(screen.getByLabelText('Conta de origem'), '1')
    await user.type(screen.getByLabelText('Conta de destino'), '2')
    await user.type(screen.getByLabelText('Valor'), '10')
    await user.click(screen.getByRole('button', { name: /^transferir$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(mensagem)
    cleanup()
  })
})
