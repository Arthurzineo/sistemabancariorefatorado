package http

import (
	"encoding/json"
	"errors"
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

func idDaRota(w stdhttp.ResponseWriter, r *stdhttp.Request) (int, bool) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		erro(w, stdhttp.StatusBadRequest, "requisicao_invalida", "id invalido")
		return 0, false
	}
	if id <= 0 {
		erro(w, stdhttp.StatusUnprocessableEntity, "id_invalido", "id deve ser positivo")
		return 0, false
	}
	return id, true
}

func decodificar(w stdhttp.ResponseWriter, r *stdhttp.Request, destino any) bool {
	r.Body = stdhttp.MaxBytesReader(w, r.Body, 1<<20)
	err := json.NewDecoder(r.Body).Decode(destino)
	if err == nil {
		return true
	}
	var limite *stdhttp.MaxBytesError
	if errors.As(err, &limite) {
		erro(w, stdhttp.StatusRequestEntityTooLarge, "corpo_muito_grande", "corpo excede 1 MiB")
		return false
	}
	erro(w, stdhttp.StatusBadRequest, "requisicao_invalida", "JSON invalido")
	return false
}

func responder(w stdhttp.ResponseWriter, status int, valor any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(valor)
}

func clienteDTO(c *clientedomain.Cliente) clienteSaida {
	return clienteSaida{
		ID: c.ID(), Nome: c.Nome(), Idade: c.Idade(), Email: c.Email(),
		IDContaCorrente: c.IDContaCorrente(), Situacao: c.Situacao(),
	}
}

func contaDTO(c *contadomain.ContaCorrente) contaSaida {
	return contaSaida{ID: c.ID(), Saldo: c.Saldo(), Situacao: c.Situacao()}
}

func clientesDTO(itens []*clientedomain.Cliente) []clienteSaida {
	saida := make([]clienteSaida, len(itens))
	for i, cliente := range itens {
		saida[i] = clienteDTO(cliente)
	}
	return saida
}

func contasDTO(itens []*contadomain.ContaCorrente) []contaSaida {
	saida := make([]contaSaida, len(itens))
	for i, conta := range itens {
		saida[i] = contaDTO(conta)
	}
	return saida
}
