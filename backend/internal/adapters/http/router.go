package http

import (
	"encoding/json"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	stdhttp "net/http"
)

func NovoRouter(clientes *clienteapp.Servico, contas *contaapp.Servico) stdhttp.Handler {
	mux := stdhttp.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	mux.HandleFunc("GET /api/clientes", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		if clientes == nil {
			erro(w, 500, "interno", "servico indisponivel")
			return
		}
		json.NewEncoder(w).Encode(clientes.Listar())
	})
	mux.HandleFunc("GET /api/contas", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		if contas == nil {
			erro(w, 500, "interno", "servico indisponivel")
			return
		}
		json.NewEncoder(w).Encode(contas.Listar())
	})
	return mux
}

func erro(w stdhttp.ResponseWriter, status int, codigo, mensagem string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"erro": codigo, "mensagem": mensagem})
}
