package conta

import (
	"errors"
	"math"
)

var (
	ErrSaldoNaoFinito = errors.New("o saldo precisa ser um numero finito")
	ErrIDInvalido     = errors.New("o identificador deve ser positivo")
)

type Situacao string

const (
	Ativa   Situacao = "Ativa"
	Inativa Situacao = "Inativa"
)

type ContaCorrente struct {
	id       int
	saldo    float64
	situacao Situacao
}

func Nova(id int, saldo float64, ativa bool) (*ContaCorrente, error) {
	if id <= 0 {
		return nil, ErrIDInvalido
	}
	if !finito(saldo) {
		return nil, ErrSaldoNaoFinito
	}
	situacao := Inativa
	if ativa {
		situacao = Ativa
	}
	return &ContaCorrente{id: id, saldo: saldo, situacao: situacao}, nil
}

func (c *ContaCorrente) ID() int               { return c.id }
func (c *ContaCorrente) Saldo() float64        { return c.saldo }
func (c *ContaCorrente) Situacao() Situacao    { return c.situacao }
func (c *ContaCorrente) EstaAtiva() bool       { return c.situacao == Ativa }
func (c *ContaCorrente) Ativar()               { c.situacao = Ativa }
func (c *ContaCorrente) Desativar()            { c.situacao = Inativa }
func (c *ContaCorrente) Copia() *ContaCorrente { copia := *c; return &copia }
func (c *ContaCorrente) DefinirSaldo(saldo float64) error {
	if !finito(saldo) {
		return ErrSaldoNaoFinito
	}
	c.saldo = saldo
	return nil
}
func finito(valor float64) bool { return !math.IsNaN(valor) && !math.IsInf(valor, 0) }
