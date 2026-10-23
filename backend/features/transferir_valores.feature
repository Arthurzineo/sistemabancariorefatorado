# language: pt
Funcionalidade: Transferência de valores entre contas
  Contexto:
    Dado que existe uma conta corrente cadastrada com id 1 e saldo 100,00
    E que existe uma conta corrente cadastrada com id 2 e saldo 0,00
  Cenário: Transferência realizada com sucesso
    Quando for solicitada a transferência de 40,00 da conta 1 para a conta 2
    Então a transferência deverá ser realizada
    E o saldo da conta 1 deverá ser 60,00
    E o saldo da conta 2 deverá ser 40,00
  Cenário: Transferência sem saldo suficiente
    Quando for solicitada a transferência de 150,00 da conta 1 para a conta 2
    Então a transferência deverá ser rejeitada
    E o saldo da conta 1 deverá ser 100,00
    E o saldo da conta 2 deverá ser 0,00
  Esquema do Cenário: Transferência com valor inválido
    Quando for solicitada a transferência de <valor> da conta 1 para a conta 2
    Então a transferência deverá ser rejeitada
    E o saldo da conta 1 deverá ser 100,00
    E o saldo da conta 2 deverá ser 0,00
    Exemplos:
      | valor |
      | 0,00 |
      | -50,00 |
  Cenário: Transferência com origem inativa
    Dado que a conta de id 1 está inativa
    Quando for solicitada a transferência de 40,00 da conta 1 para a conta 2
    Então a transferência deverá ser rejeitada
  Cenário: Transferência com destino inativa
    Dado que a conta de id 2 está inativa
    Quando for solicitada a transferência de 40,00 da conta 1 para a conta 2
    Então a transferência deverá ser rejeitada
