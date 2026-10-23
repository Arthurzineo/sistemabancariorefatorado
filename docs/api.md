# API REST (contrato proposto)

Base: `/api`. JSON em UTF-8. O frontend chama sempre o caminho relativo `/api/...`; o nginx
repassa para o backend.

## Saúde

| Método | Rota | Uso | Sucesso |
|---|---|---|---|
| GET | `/api/health` | healthcheck do container (docs/infra-docker.md) | 200 `{ "status": "ok" }` |

## Clientes

| Método | Rota | Req. | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/clientes` | Q03 | 200 lista | — |
| GET | `/api/clientes/{id}` | R01 | 200 cliente | 404 |
| POST | `/api/clientes` | R02, R03 | 201 cliente | 409 id duplicado, 422 idade inválida, 400 JSON inválido |
| GET | `/api/clientes/validacao-idade?idade=N` | R03 | 200 `{ "idade": N, "permitida": bool, "mensagem": "..." }` | 400 |
| POST | `/api/clientes/{id}/ativar` | R04 | 200 cliente | 404 |
| POST | `/api/clientes/{id}/desativar` | R05 | 200 cliente | 404 |
| GET | `/api/clientes/{id}/situacao` | R06 | 200 `{ "situacao": "Ativo" }` | 404 |
| DELETE | `/api/clientes/{id}` | R07 | 204 | 404 |

Corpo do cadastro (entrada usa `ativo` booleano, como o construtor original; a saída sempre usa `situacao`: `"Ativo"`/`"Inativo"`):
```json
{ "id": 3, "nome": "Ana", "idade": 25, "email": "ana@ex.com", "idContaCorrente": 3, "ativo": true }
```

## Contas correntes

| Método | Rota | Req. | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/contas` | Q03 | 200 lista | — |
| GET | `/api/contas/{id}` | R08 | 200 `{ "id":1, "saldo":100.0, "situacao":"Ativa" }` | 404 |
| POST | `/api/contas` | R09 | 201 conta | 409 id duplicado, 422 saldo inválido, 400 |
| POST | `/api/contas/{id}/ativar` | Q02 | 200 conta | 404 |
| POST | `/api/contas/{id}/desativar` | Q02 | 200 conta | 404 |
| GET | `/api/contas/{id}/situacao` | R10 | 200 `{ "situacao": "Ativa" }` | 404 |
| DELETE | `/api/contas/{id}` | R11 | 204 | 404 |

## Transferência

| Método | Rota | Req. | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/api/transferencias` | R12 | 200 `{ "origem": {conta}, "destino": {conta} }` | 404 origem/destino inexistente, 422 valor inválido / saldo insuficiente / saldo do destino não finito / conta de origem ou destino inativa |

```json
{ "origem": 1, "destino": 2, "valor": 40.0 }
```

## Formato de erro

```json
{ "erro": "saldo_insuficiente", "mensagem": "Saldo insuficiente na conta de origem." }
```

| Erro de domínio | Código | HTTP |
|---|---|---|
| `ErrClienteNaoEncontrado` | `cliente_nao_encontrado` | 404 |
| `ErrContaNaoEncontrada` | `conta_nao_encontrada` | 404 |
| `ErrContaOrigemNaoEncontrada` | `conta_origem_nao_encontrada` | 404 |
| `ErrContaDestinoNaoEncontrada` | `conta_destino_nao_encontrada` | 404 |
| `ErrIdDuplicado` | `id_duplicado` | 409 |
| `ErrIdadeNaoPermitida` | `idade_nao_permitida` | 422 |
| `ErrSaldoNaoFinito` | `saldo_nao_finito` | 422 |
| `ErrValorInvalido` | `valor_invalido` | 422 |
| `ErrSaldoInsuficiente` | `saldo_insuficiente` | 422 |
| `ErrCreditoNaoFinito` | `credito_nao_finito` | 422 |
| `ErrContaOrigemInativa` | `conta_origem_inativa` | 422 |
| `ErrContaDestinoInativa` | `conta_destino_inativa` | 422 |
| JSON malformado / tipo errado | `requisicao_invalida` | 400 |

Observação: JSON não representa `NaN`/`Infinity`. A regra de saldo finito continua no domínio
(ela protege contra overflow no crédito e contra dados vindos de outros adapters).
