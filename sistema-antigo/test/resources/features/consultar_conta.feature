# language: pt
# Requisito 8 - Consultar conta corrente
Funcionalidade: Consulta de conta corrente

  Como operador do sistema bancário
  Quero consultar uma conta corrente pelo seu número
  Para verificar o saldo e a situação da conta

  Cenário: Consultar conta corrente ativa
    Dado que existe uma conta corrente cadastrada com id 1 e saldo 100,00
    Quando o operador consultar a conta de id 1
    Então o sistema deverá retornar a conta de id 1
    E o saldo exibido deverá ser 100,00
    E a situação exibida deverá ser "Ativa"

  Cenário: Consultar conta corrente inativa
    Dado que existe uma conta corrente cadastrada com id 2 e saldo 50,00
    E que a conta de id 2 está inativa
    Quando o operador consultar a conta de id 2
    Então o sistema deverá retornar a conta de id 2
    E o saldo exibido deverá ser 50,00
    E a situação exibida deverá ser "Inativa"

  Cenário: Consultar conta corrente inexistente
    Dado que não existe conta corrente cadastrada com id 99
    Quando o operador consultar a conta de id 99
    Então o sistema deverá informar que a conta não foi encontrada
