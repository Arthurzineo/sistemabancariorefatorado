# language: pt
Funcionalidade: Consulta de cliente
  Cenário: Consultar cliente existente
    Dado que existe um cliente cadastrado com id 1 e nome "Maria Silva"
    Quando o operador consultar o cliente de id 1
    Então o sistema deverá retornar o cliente "Maria Silva"
  Cenário: Consultar cliente inexistente
    Dado que não existe cliente cadastrado com id 99
    Quando o operador consultar o cliente de id 99
    Então o sistema deverá informar que o cliente não foi encontrado
