package http

import (
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	stdhttp "net/http"
)

func NovoRouter(clientes *clienteapp.Servico, contas *contaapp.Servico) stdhttp.Handler {
	mux := stdhttp.NewServeMux()
	mux.HandleFunc("GET /api/health", healthHandler)
	registrarRotasClientes(mux, clientes)
	registrarRotasContas(mux, contas)
	mux.HandleFunc("POST /api/transferencias", transferenciaHandler(contas))
	return mux
}

func healthHandler(w stdhttp.ResponseWriter, _ *stdhttp.Request) {
	responder(w, stdhttp.StatusOK, map[string]string{"status": "ok"})
}
