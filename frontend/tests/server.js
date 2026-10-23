import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(
  http.get('/api/clientes', () => HttpResponse.json([{ id: 1, nome: 'Ana', idade: 25, email: 'ana@ex.com', idContaCorrente: 1, situacao: 'Ativo' }])),
  http.get('/api/contas', () => HttpResponse.json([{ id: 1, saldo: 100, situacao: 'Ativa' }])),
  http.get('/api/clientes/validacao-idade', () => HttpResponse.json({ idade: 25, permitida: true, mensagem: 'idade permitida' })),
  http.post('/api/clientes', () => HttpResponse.json({ id: 2, nome: 'Bia', idade: 30, email: 'bia@ex.com', idContaCorrente: 2, situacao: 'Ativo' }, { status: 201 })),
  http.post('/api/contas', () => HttpResponse.json({ id: 2, saldo: 0, situacao: 'Ativa' }, { status: 201 })),
  http.post('/api/transferencias', () => HttpResponse.json({ erro: 'saldo_insuficiente', mensagem: 'Saldo insuficiente na conta de origem.' }, { status: 422 }))
)
