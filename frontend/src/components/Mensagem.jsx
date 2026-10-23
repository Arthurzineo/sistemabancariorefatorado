export default function Mensagem({ texto, erro = false }) { return texto ? <p role={erro ? 'alert' : 'status'}>{texto}</p> : null }
