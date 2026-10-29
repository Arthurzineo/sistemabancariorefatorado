package http

import (
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	stdhttp "net/http"
)

func transferenciaHandler(s *contaapp.Servico) stdhttp.HandlerFunc {
	return func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		var in transferenciaEntrada
		if !decodificar(w, r, &in) {
			return
		}
		if err := s.Transferir(in.Origem, in.Destino, in.Valor); err != nil {
			mapearErro(w, err)
			return
		}
		origem, _ := s.Consultar(in.Origem)
		destino, _ := s.Consultar(in.Destino)
		responder(w, stdhttp.StatusOK, map[string]contaSaida{
			"origem": contaDTO(origem), "destino": contaDTO(destino),
		})
	}
}
