import { requisicao } from "./http.js";
export const listarContas = () => requisicao("/api/contas");
export const consultarConta = (id) => requisicao(`/api/contas/${id}`);
export const situacaoConta = (id) => requisicao(`/api/contas/${id}/situacao`);
export const cadastrarConta = (dados) =>
  requisicao("/api/contas", { method: "POST", body: JSON.stringify(dados) });
export const acaoConta = (id, acao) =>
  requisicao(`/api/contas/${id}/${acao}`, { method: "POST" });
export const removerConta = (id) =>
  requisicao(`/api/contas/${id}`, { method: "DELETE" });
export const transferir = (dados) =>
  requisicao("/api/transferencias", {
    method: "POST",
    body: JSON.stringify(dados),
  });
