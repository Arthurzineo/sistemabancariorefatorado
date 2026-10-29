# language: pt
# Requisito 12 - Transferir valores entre contas (analise integrada TDD + BDD + DDD)
Funcionalidade: Transferência de valores entre contas

  Como cliente do banco
  Quero transferir valores da minha conta corrente para outra conta
  Para movimentar meu dinheiro sem precisar sacar e depositar

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
      | valor  |
      | 0,00   |
      | -50,00 |
