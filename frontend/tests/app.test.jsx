import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App.jsx'

describe('Sistema Bancário', () => {
  it('navega entre clientes e contas com controles acessíveis', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: /sistema bancário/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /contas/i }))
    expect(screen.getByRole('heading', { name: /contas correntes/i })).toBeInTheDocument()
  })
})
