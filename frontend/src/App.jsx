import { useState } from 'react'
import Clientes from './features/clientes/Clientes.jsx'
import Contas from './features/contas/Contas.jsx'
import './styles/app.css'
export default function App(){const [aba,setAba]=useState('clientes');return <main><header><h1>Sistema Bancário</h1><nav aria-label="Navegação principal"><button aria-pressed={aba==='clientes'} onClick={()=>setAba('clientes')}>Clientes</button><button aria-pressed={aba==='contas'} onClick={()=>setAba('contas')}>Contas</button></nav></header>{aba==='clientes'?<Clientes/>:<Contas/>}</main>}
