package conta

import (
	"errors"
	"math"
)

var (
	ErrContaOrigemNaoEncontrada  = errors.New("conta de origem nao encontrada")
	ErrContaDestinoNaoEncontrada = errors.New("conta de destino nao encontrada")
	ErrValorInvalido             = errors.New("valor de transferencia invalido")
	ErrSaldoInsuficiente         = errors.New("saldo insuficiente na conta de origem")
	ErrCreditoNaoFinito          = errors.New("credito deixaria saldo de destino nao finito")
	ErrContaOrigemInativa        = errors.New("conta de origem inativa")
	ErrContaDestinoInativa       = errors.New("conta de destino inativa")
	ErrContaOrigemEDestinoIguais = errors.New("conta de origem e destino devem ser diferentes")
)

func Transferir(origem, destino *ContaCorrente, valor float64) error {
	if origem == nil {
		return ErrContaOrigemNaoEncontrada
	}
	if destino == nil {
		return ErrContaDestinoNaoEncontrada
	}
	if origem.ID() == destino.ID() {
		return ErrContaOrigemEDestinoIguais
	}
	if valor <= 0 || math.IsNaN(valor) {
		return ErrValorInvalido
	}
	if !origem.EstaAtiva() {
		return ErrContaOrigemInativa
	}
	if !destino.EstaAtiva() {
		return ErrContaDestinoInativa
	}
	if origem.saldo < valor {
		return ErrSaldoInsuficiente
	}
	if !finito(destino.saldo + valor) {
		return ErrCreditoNaoFinito
	}
	origem.saldo -= valor
	destino.saldo += valor
	return nil
}
