# language: pt
# Requisito 5 - Desativar cliente
Funcionalidade: Desativação de cliente

  Como operador do sistema bancário
  Quero desativar um cliente cadastrado
  Para impedir que ele seja tratado como cliente ativo do banco

  Cenário: Desativar cliente ativo
    Dado que existe um cliente cadastrado com id 1 e nome "Maria Silva"
    E que o cliente de id 1 está ativo
    Quando for solicitada a desativação do cliente de id 1
    Então a operação deverá ser concluída com sucesso
    E o cliente de id 1 deverá ficar inativo

  Cenário: Desativar cliente que já está inativo
    Dado que existe um cliente cadastrado com id 1 e nome "Maria Silva"
    E que o cliente de id 1 está inativo
    Quando for solicitada a desativação do cliente de id 1
    Então a operação deverá ser concluída com sucesso
    E o cliente de id 1 deverá ficar inativo

  Cenário: Tentar desativar cliente inexistente
    Dado que não existe cliente cadastrado com id 99
    Quando for solicitada a desativação do cliente de id 99
    Então a operação deverá ser rejeitada
