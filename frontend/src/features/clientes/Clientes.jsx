import { useEffect, useState } from 'react'
import { acaoCliente, cadastrarCliente, consultarCliente, listarClientes, removerCliente, validarIdade } from '../../api/clientes.js'
import Mensagem from '../../components/Mensagem.jsx'
const inicial = { id: '', nome: '', idade: '', email: '', idContaCorrente: '', ativo: true }
export default function Clientes() {
  const [clientes, setClientes] = useState([]), [form, setForm] = useState(inicial), [consulta, setConsulta] = useState(''), [mensagem, setMensagem] = useState(''), [erro, setErro] = useState(false)
  const carregar = () => listarClientes().then(setClientes).catch((e) => avisar(e.message, true))
  useEffect(() => { carregar() }, [])
  const avisar = (texto, falhou = false) => { setMensagem(texto); setErro(falhou) }
  const enviar = async (e) => { e.preventDefault(); try { await cadastrarCliente({ ...form, id: Number(form.id), idade: Number(form.idade), idContaCorrente: Number(form.idContaCorrente) }); setForm(inicial); avisar('Cliente cadastrado.'); carregar() } catch (x) { avisar(x.message, true) } }
  const idade = async () => { try { const r = await validarIdade(form.idade); avisar(r.mensagem, !r.permitida) } catch (x) { avisar(x.message, true) } }
  const executar = async (id, acao) => { try { if (acao === 'remover') await removerCliente(id); else await acaoCliente(id, acao); avisar('Operação concluída.'); carregar() } catch (x) { avisar(x.message, true) } }
  const consultar = async e => { e.preventDefault(); try { const c = await consultarCliente(consulta); avisar(`Cliente: ${c.nome} — ${c.situacao}`) } catch (x) { avisar(x.message, true) } }
  return <section><h2>Clientes</h2><Mensagem texto={mensagem} erro={erro}/><form onSubmit={consultar}><h3>Consultar cliente</h3><label>ID do cliente<input type="number" value={consulta} onChange={e=>setConsulta(e.target.value)} required/></label><button>Consultar cliente</button></form><form onSubmit={enviar}><h3>Cadastrar cliente</h3>{[['id','ID'],['nome','Nome'],['idade','Idade'],['email','E-mail'],['idContaCorrente','ID da conta corrente']].map(([nome,rotulo]) => <label key={nome}>{rotulo}<input name={nome} type={nome === 'idade' || nome.includes('id') ? 'number' : 'text'} value={form[nome]} onChange={e => setForm({...form,[nome]:e.target.value})} required/></label>)}<label>Ativo<input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})}/></label><button type="button" onClick={idade}>Validar idade</button><button>Cadastrar cliente</button></form><h3>Lista de clientes</h3><ul>{clientes.map(c=><li key={c.id}><strong>{c.nome}</strong> — {c.situacao} <button onClick={()=>executar(c.id,'ativar')}>Ativar</button><button onClick={()=>executar(c.id,'desativar')}>Desativar</button><button onClick={()=>executar(c.id,'remover')}>Remover</button></li>)}</ul></section>
}
