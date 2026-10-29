package http

import (
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	clientedomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	stdhttp "net/http"
	"strconv"
)

func registrarRotasClientes(mux *stdhttp.ServeMux, s *clienteapp.Servico) {
	mux.HandleFunc("GET /api/clientes", listarClientes(s))
	mux.HandleFunc("POST /api/clientes", cadastrarCliente(s))
	mux.HandleFunc("GET /api/clientes/validacao-idade", validarIdade(s))
	mux.HandleFunc("GET /api/clientes/{id}", consultarCliente(s))
	mux.HandleFunc("POST /api/clientes/{id}/ativar", acaoCliente(s, true))
	mux.HandleFunc("POST /api/clientes/{id}/desativar", acaoCliente(s, false))
	mux.HandleFunc("GET /api/clientes/{id}/situacao", situacaoCliente(s))
	mux.HandleFunc("DELETE /api/clientes/{id}", removerCliente(s))
}

func listarClientes(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, _ *stdhttp.Request) {
		responder(w, stdhttp.StatusOK, clientesDTO(s.Listar()))
	}
}

func cadastrarCliente(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in clienteEntrada
		if !decodificar(w, r, &in) {
			return
		}
		c, err := s.Cadastrar(in.ID, in.Nome, in.Idade, in.Email, in.IDContaCorrente, in.Ativo)
		if err != nil {
			mapearErro(w, err)
			return
		}
		responder(w, stdhttp.StatusCreated, clienteDTO(c))
	}
}

func validarIdade(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		valor := r.URL.Query().Get("idade")
		idade, err := strconv.Atoi(valor)
		if err != nil || valor == "" {
			erro(w, stdhttp.StatusBadRequest, "requisicao_invalida", "idade invalida")
			return
		}
		permitida := s.IdadePermitida(idade)
		mensagem := "idade permitida"
		if !permitida {
			mensagem = "idade nao permitida"
		}
		responder(w, stdhttp.StatusOK, map[string]any{
			"idade": idade, "permitida": permitida, "mensagem": mensagem,
		})
	}
}

func consultarCliente(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		c, err := s.Consultar(id)
		if err != nil {
			mapearErro(w, err)
			return
		}
		responder(w, stdhttp.StatusOK, clienteDTO(c))
	}
}

func acaoCliente(s *clienteapp.Servico, ativar bool) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		var err error
		if ativar {
			err = s.Ativar(id)
		} else {
			err = s.Desativar(id)
		}
		if err != nil {
			mapearErro(w, err)
			return
		}
		c, _ := s.Consultar(id)
		responder(w, stdhttp.StatusOK, clienteDTO(c))
	}
}

func situacaoCliente(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		situacao, err := s.Situacao(id)
		if err != nil {
			mapearErro(w, err)
			return
		}
		responder(w, stdhttp.StatusOK, map[string]clientedomain.Situacao{"situacao": situacao})
	}
}

func removerCliente(s *clienteapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		id, ok := idDaRota(w, r)
		if !ok {
			return
		}
		if err := s.Remover(id); err != nil {
			mapearErro(w, err)
			return
		}
		w.WriteHeader(stdhttp.StatusNoContent)
	}
}
