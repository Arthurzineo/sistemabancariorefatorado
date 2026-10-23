package http

import (
	"encoding/json"
	"errors"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	clientedomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	contadomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	stdhttp "net/http"
	"strconv"
)

type clienteEntrada struct {
	ID              int    `json:"id"`
	Nome            string `json:"nome"`
	Idade           int    `json:"idade"`
	Email           string `json:"email"`
	IDContaCorrente int    `json:"idContaCorrente"`
	Ativo           bool   `json:"ativo"`
}
type contaEntrada struct {
	ID    int     `json:"id"`
	Saldo float64 `json:"saldo"`
	Ativo bool    `json:"ativo"`
}
type transferenciaEntrada struct {
	Origem  int     `json:"origem"`
	Destino int     `json:"destino"`
	Valor   float64 `json:"valor"`
}
type clienteSaida struct {
	ID              int                    `json:"id"`
	Nome            string                 `json:"nome"`
	Idade           int                    `json:"idade"`
	Email           string                 `json:"email"`
	IDContaCorrente int                    `json:"idContaCorrente"`
	Situacao        clientedomain.Situacao `json:"situacao"`
}
type contaSaida struct {
	ID       int                  `json:"id"`
	Saldo    float64              `json:"saldo"`
	Situacao contadomain.Situacao `json:"situacao"`
}

func NovoRouter(clientes *clienteapp.Servico, contas *contaapp.Servico) stdhttp.Handler {
	mux := stdhttp.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		responder(w, 200, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("GET /api/clientes", func(w stdhttp.ResponseWriter, r *stdhttp.Request) { responder(w, 200, clientesDTO(clientes.Listar())) })
	mux.HandleFunc("POST /api/clientes", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in clienteEntrada
		if !decodificar(w, r, &in) {
			return
		}
		c, e := clientes.Cadastrar(in.ID, in.Nome, in.Idade, in.Email, in.IDContaCorrente, in.Ativo)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 201, clienteDTO(c))
	})
	mux.HandleFunc("GET /api/clientes/validacao-idade", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		valor := r.URL.Query().Get("idade")
		idade, e := strconv.Atoi(valor)
		if e != nil || valor == "" {
			erro(w, 400, "requisicao_invalida", "idade invalida")
			return
		}
		permitida := clientes.IdadePermitida(idade)
		mensagem := "idade permitida"
		if !permitida {
			mensagem = "idade nao permitida"
		}
		responder(w, 200, map[string]any{"idade": idade, "permitida": permitida, "mensagem": mensagem})
	})
	mux.HandleFunc("GET /api/clientes/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		c, e := clientes.Consultar(id)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 200, clienteDTO(c))
	})
	mux.HandleFunc("POST /api/clientes/{id}/ativar", acaoCliente(clientes, true))
	mux.HandleFunc("POST /api/clientes/{id}/desativar", acaoCliente(clientes, false))
	mux.HandleFunc("GET /api/clientes/{id}/situacao", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		s, e := clientes.Situacao(id)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 200, map[string]clientedomain.Situacao{"situacao": s})
	})
	mux.HandleFunc("DELETE /api/clientes/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		if e := clientes.Remover(id); e != nil {
			mapearErro(w, e)
			return
		}
		w.WriteHeader(204)
	})
	mux.HandleFunc("GET /api/contas", func(w stdhttp.ResponseWriter, r *stdhttp.Request) { responder(w, 200, contasDTO(contas.Listar())) })
	mux.HandleFunc("POST /api/contas", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in contaEntrada
		if !decodificar(w, r, &in) {
			return
		}
		c, e := contas.Cadastrar(in.ID, in.Saldo, in.Ativo)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 201, contaDTO(c))
	})
	mux.HandleFunc("GET /api/contas/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		c, e := contas.Consultar(id)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 200, contaDTO(c))
	})
	mux.HandleFunc("POST /api/contas/{id}/ativar", acaoConta(contas, true))
	mux.HandleFunc("POST /api/contas/{id}/desativar", acaoConta(contas, false))
	mux.HandleFunc("GET /api/contas/{id}/situacao", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		s, e := contas.Situacao(id)
		if e != nil {
			mapearErro(w, e)
			return
		}
		responder(w, 200, map[string]contadomain.Situacao{"situacao": s})
	})
	mux.HandleFunc("DELETE /api/contas/{id}", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		if e := contas.Remover(id); e != nil {
			mapearErro(w, e)
			return
		}
		w.WriteHeader(204)
	})
	mux.HandleFunc("POST /api/transferencias", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in transferenciaEntrada
		if !decodificar(w, r, &in) {
			return
		}
		if e := contas.Transferir(in.Origem, in.Destino, in.Valor); e != nil {
			mapearErro(w, e)
			return
		}
		origem, _ := contas.Consultar(in.Origem)
		destino, _ := contas.Consultar(in.Destino)
		responder(w, 200, map[string]contaSaida{"origem": contaDTO(origem), "destino": contaDTO(destino)})
	})
	return mux
}
func acaoCliente(s *clienteapp.Servico, ativar bool) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		var e error
		if ativar {
			e = s.Ativar(id)
		} else {
			e = s.Desativar(id)
		}
		if e != nil {
			mapearErro(w, e)
			return
		}
		c, _ := s.Consultar(id)
		responder(w, 200, clienteDTO(c))
	}
}
func acaoConta(s *contaapp.Servico, ativar bool) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		var e error
		if ativar {
			e = s.Ativar(id)
		} else {
			e = s.Desativar(id)
		}
		if e != nil {
			mapearErro(w, e)
			return
		}
		c, _ := s.Consultar(id)
		responder(w, 200, contaDTO(c))
	}
}
func idDaRota(w stdhttp.ResponseWriter, r *stdhttp.Request) (int, bool) {
	id, e := strconv.Atoi(r.PathValue("id"))
	if e != nil {
		erro(w, 400, "requisicao_invalida", "id invalido")
		return 0, false
	}
	if id <= 0 {
		erro(w, 400, "requisicao_invalida", "id deve ser positivo")
		return 0, false
	}
	return id, true
}
func decodificar(w stdhttp.ResponseWriter, r *stdhttp.Request, destino any) bool {
	r.Body = stdhttp.MaxBytesReader(w, r.Body, 1<<20)
	if e := json.NewDecoder(r.Body).Decode(destino); e != nil {
		erro(w, 400, "requisicao_invalida", "JSON invalido")
		return false
	}
	return true
}
func responder(w stdhttp.ResponseWriter, status int, valor any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(valor)
}
func clienteDTO(c *clientedomain.Cliente) clienteSaida {
	return clienteSaida{c.ID(), c.Nome(), c.Idade(), c.Email(), c.IDContaCorrente(), c.Situacao()}
}
func contaDTO(c *contadomain.ContaCorrente) contaSaida {
	return contaSaida{c.ID(), c.Saldo(), c.Situacao()}
}
func clientesDTO(itens []*clientedomain.Cliente) []clienteSaida {
	saida := make([]clienteSaida, len(itens))
	for i, c := range itens {
		saida[i] = clienteDTO(c)
	}
	return saida
}
func contasDTO(itens []*contadomain.ContaCorrente) []contaSaida {
	saida := make([]contaSaida, len(itens))
	for i, c := range itens {
		saida[i] = contaDTO(c)
	}
	return saida
}
func erro(w stdhttp.ResponseWriter, status int, codigo, mensagem string) {
	responder(w, status, map[string]string{"erro": codigo, "mensagem": mensagem})
}
func mapearErro(w stdhttp.ResponseWriter, e error) {
	codigo, status := "erro", 422
	switch {
	case errors.Is(e, contadomain.ErrContaOrigemEDestinoIguais):
		codigo, status = "contas_iguais", 422
	case errors.Is(e, clientedomain.ErrIDInvalido), errors.Is(e, contadomain.ErrIDInvalido):
		codigo, status = "id_invalido", 400
	case errors.Is(e, clientedomain.ErrNomeInvalido):
		codigo = "nome_invalido"
	case errors.Is(e, clientedomain.ErrEmailInvalido):
		codigo = "email_invalido"
	case errors.Is(e, clienteapp.ErrClienteNaoEncontrado):
		codigo, status = "cliente_nao_encontrado", 404
	case errors.Is(e, contaapp.ErrContaNaoEncontrada):
		codigo, status = "conta_nao_encontrada", 404
	case errors.Is(e, contadomain.ErrContaOrigemNaoEncontrada):
		codigo, status = "conta_origem_nao_encontrada", 404
	case errors.Is(e, contadomain.ErrContaDestinoNaoEncontrada):
		codigo, status = "conta_destino_nao_encontrada", 404
	case errors.Is(e, clienteapp.ErrIDDuplicado), errors.Is(e, contaapp.ErrIDDuplicado):
		codigo, status = "id_duplicado", 409
	case errors.Is(e, clientedomain.ErrIdadeNaoPermitida):
		codigo = "idade_nao_permitida"
	case errors.Is(e, contadomain.ErrSaldoNaoFinito):
		codigo = "saldo_nao_finito"
	case errors.Is(e, contadomain.ErrValorInvalido):
		codigo = "valor_invalido"
	case errors.Is(e, contadomain.ErrSaldoInsuficiente):
		codigo = "saldo_insuficiente"
	case errors.Is(e, contadomain.ErrCreditoNaoFinito):
		codigo = "credito_nao_finito"
	case errors.Is(e, contadomain.ErrContaOrigemInativa):
		codigo = "conta_origem_inativa"
	case errors.Is(e, contadomain.ErrContaDestinoInativa):
		codigo = "conta_destino_inativa"
	}
	erro(w, status, codigo, e.Error())
}
