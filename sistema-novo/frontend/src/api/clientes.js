import { requisicao } from "./http.js";
export const listarClientes = () => requisicao("/api/clientes");
export const consultarCliente = (id) => requisicao(`/api/clientes/${id}`);
export const situacaoCliente = (id) =>
  requisicao(`/api/clientes/${id}/situacao`);
export const cadastrarCliente = (dados) =>
  requisicao("/api/clientes", { method: "POST", body: JSON.stringify(dados) });
export const acaoCliente = (id, acao) =>
  requisicao(`/api/clientes/${id}/${acao}`, { method: "POST" });
export const removerCliente = (id) =>
  requisicao(`/api/clientes/${id}`, { method: "DELETE" });
export const validarIdade = (idade) =>
  requisicao(`/api/clientes/validacao-idade?idade=${idade}`);
