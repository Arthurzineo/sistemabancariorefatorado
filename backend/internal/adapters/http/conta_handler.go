package http

import (
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	contadomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	stdhttp "net/http"
)

func registrarRotasContas(mux *stdhttp.ServeMux, s *contaapp.Servico) {
	mux.HandleFunc("GET /api/contas", listarContas(s))
	mux.HandleFunc("POST /api/contas", cadastrarConta(s))
	mux.HandleFunc("GET /api/contas/{id}", consultarConta(s))
	mux.HandleFunc("POST /api/contas/{id}/ativar", acaoConta(s, true))
	mux.HandleFunc("POST /api/contas/{id}/desativar", acaoConta(s, false))
	mux.HandleFunc("GET /api/contas/{id}/situacao", situacaoConta(s))
	mux.HandleFunc("DELETE /api/contas/{id}", removerConta(s))
}

func listarContas(s *contaapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, _ *stdhttp.Request) {
		responder(w, stdhttp.StatusOK, contasDTO(s.Listar()))
	}
}

func cadastrarConta(s *contaapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in contaEntrada
		if !decodificar(w, r, &in) {
			return
		}
		c, err := s.Cadastrar(in.ID, in.Saldo, in.Ativo)
		if err != nil {
			mapearErro(w, err)
			return
		}
		responder(w, stdhttp.StatusCreated, contaDTO(c))
	}
}

func consultarConta(s *contaapp.Servico) stdhttp.HandlerFunc {
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
		responder(w, stdhttp.StatusOK, contaDTO(c))
	}
}

func acaoConta(s *contaapp.Servico, ativar bool) stdhttp.HandlerFunc {
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
		responder(w, stdhttp.StatusOK, contaDTO(c))
	}
}

func situacaoConta(s *contaapp.Servico) stdhttp.HandlerFunc {
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
		responder(w, stdhttp.StatusOK, map[string]contadomain.Situacao{"situacao": situacao})
	}
}

func removerConta(s *contaapp.Servico) stdhttp.HandlerFunc {
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
