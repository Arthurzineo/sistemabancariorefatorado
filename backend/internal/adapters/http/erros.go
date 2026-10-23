package http

import (
	"errors"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	clientedomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	contadomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	stdhttp "net/http"
)

func erro(w stdhttp.ResponseWriter, status int, codigo, mensagem string) {
	responder(w, status, map[string]string{"erro": codigo, "mensagem": mensagem})
}

func mapearErro(w stdhttp.ResponseWriter, err error) {
	codigo, status := codigoEStatus(err)
	erro(w, status, codigo, err.Error())
}

func codigoEStatus(err error) (string, int) {
	codigo, status := "erro", stdhttp.StatusUnprocessableEntity
	switch {
	case errors.Is(err, contadomain.ErrMesmaConta):
		codigo = "mesma_conta"
	case errors.Is(err, clientedomain.ErrIDInvalido), errors.Is(err, contadomain.ErrIDInvalido):
		codigo = "id_invalido"
	case errors.Is(err, clientedomain.ErrNomeInvalido):
		codigo = "nome_invalido"
	case errors.Is(err, clientedomain.ErrEmailInvalido):
		codigo = "email_invalido"
	case errors.Is(err, clienteapp.ErrClienteNaoEncontrado):
		codigo, status = "cliente_nao_encontrado", stdhttp.StatusNotFound
	case errors.Is(err, contaapp.ErrContaNaoEncontrada):
		codigo, status = "conta_nao_encontrada", stdhttp.StatusNotFound
	case errors.Is(err, contadomain.ErrContaOrigemNaoEncontrada):
		codigo, status = "conta_origem_nao_encontrada", stdhttp.StatusNotFound
	case errors.Is(err, contadomain.ErrContaDestinoNaoEncontrada):
		codigo, status = "conta_destino_nao_encontrada", stdhttp.StatusNotFound
	case errors.Is(err, clienteapp.ErrIDDuplicado), errors.Is(err, contaapp.ErrIDDuplicado):
		codigo, status = "id_duplicado", stdhttp.StatusConflict
	case errors.Is(err, clientedomain.ErrIdadeNaoPermitida):
		codigo = "idade_nao_permitida"
	case errors.Is(err, contadomain.ErrSaldoNaoFinito):
		codigo = "saldo_nao_finito"
	case errors.Is(err, contadomain.ErrValorInvalido):
		codigo = "valor_invalido"
	case errors.Is(err, contadomain.ErrSaldoInsuficiente):
		codigo = "saldo_insuficiente"
	case errors.Is(err, contadomain.ErrCreditoNaoFinito):
		codigo = "credito_nao_finito"
	case errors.Is(err, contadomain.ErrContaOrigemInativa):
		codigo = "conta_origem_inativa"
	case errors.Is(err, contadomain.ErrContaDestinoInativa):
		codigo = "conta_destino_inativa"
	}
	return codigo, status
}
