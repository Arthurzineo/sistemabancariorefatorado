import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App.jsx'

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
})
