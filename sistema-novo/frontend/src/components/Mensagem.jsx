import { Toast } from "./Toast.jsx";

export default function Mensagem({ texto, erro }) {
  return <Toast texto={texto} erro={erro} />;
}
