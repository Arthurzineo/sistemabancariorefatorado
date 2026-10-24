const mensagens = {
  saldo_insuficiente: "Saldo insuficiente na conta de origem.",
  valor_invalido: "Valor de transferência inválido.",
  conta_origem_nao_encontrada: "Conta de origem não encontrada.",
  conta_destino_nao_encontrada: "Conta de destino não encontrada.",
  conta_origem_inativa: "Conta de origem inativa.",
  conta_destino_inativa: "Conta de destino inativa.",
  mesma_conta: "A conta de origem e destino devem ser diferentes.",
  id_invalido: "O identificador deve ser positivo.",
};

export function mensagemDeErro(erro, fallback) {
  return mensagens[erro] || fallback || "Não foi possível concluir a operação.";
}
