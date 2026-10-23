export async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) }, ...opcoes })
  if (resposta.status === 204) return null
  const dados = await resposta.json()
  if (!resposta.ok) throw new Error(dados.mensagem || 'Não foi possível concluir a operação.')
  return dados
}
