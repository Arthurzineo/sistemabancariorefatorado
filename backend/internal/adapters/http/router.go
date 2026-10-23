package http

import (
	"encoding/json"
	"errors"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	stdhttp "net/http"
	"strconv"
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
	mux.HandleFunc("GET /api/clientes/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, e := strconv.Atoi(r.PathValue("id"))
		if e != nil {
			erro(w, 400, "requisicao_invalida", "id invalido")
			return
		}
		c, e := clientes.Consultar(id)
		if e != nil {
			erro(w, 404, "cliente_nao_encontrado", e.Error())
			return
		}
		_ = json.NewEncoder(w).Encode(c)
	})
	mux.HandleFunc("GET /api/contas/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, e := strconv.Atoi(r.PathValue("id"))
		if e != nil {
			erro(w, 400, "requisicao_invalida", "id invalido")
			return
		}
		c, e := contas.Consultar(id)
		if e != nil {
			erro(w, 404, "conta_nao_encontrada", e.Error())
			return
		}
		_ = json.NewEncoder(w).Encode(c)
	})
	mux.HandleFunc("POST /api/transferencias", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in struct {
			Origem  int     `json:"origem"`
			Destino int     `json:"destino"`
			Valor   float64 `json:"valor"`
		}
		if json.NewDecoder(r.Body).Decode(&in) != nil {
			erro(w, 400, "requisicao_invalida", "JSON invalido")
			return
		}
		if e := contas.Transferir(in.Origem, in.Destino, in.Valor); e != nil {
			mapearErro(w, e)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	return mux
}

func erro(w stdhttp.ResponseWriter, status int, codigo, mensagem string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"erro": codigo, "mensagem": mensagem})
}
func mapearErro(w stdhttp.ResponseWriter, e error) {
	codigo, status := "erro", 422
	switch {
	case errors.Is(e, contaapp.ErrContaNaoEncontrada):
		codigo, status = "conta_nao_encontrada", 404
	case errors.Is(e, contaapp.ErrIDDuplicado):
		codigo, status = "id_duplicado", 409
	case errors.Is(e, clienteapp.ErrClienteNaoEncontrado):
		codigo, status = "cliente_nao_encontrado", 404
	}
	erro(w, status, codigo, e.Error())
}
