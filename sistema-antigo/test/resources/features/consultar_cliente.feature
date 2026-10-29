# language: pt
# Requisito 1 - Consultar cliente
Funcionalidade: Consulta de cliente

  Como operador do sistema bancário
  Quero consultar um cliente pelo seu identificador
  Para visualizar os dados cadastrais do cliente

  Cenário: Consultar cliente existente
    Dado que existe um cliente cadastrado com id 1 e nome "Maria Silva"
    Quando o operador consultar o cliente de id 1
    Então o sistema deverá retornar o cliente "Maria Silva"

  Cenário: Consultar cliente inexistente
    Dado que não existe cliente cadastrado com id 99
    Quando o operador consultar o cliente de id 99
    Então o sistema deverá informar que o cliente não foi encontrado
