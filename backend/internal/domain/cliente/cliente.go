package cliente

import "errors"

const (
	IdadeMinima = 18
	IdadeMaxima = 65
)

var ErrIdadeNaoPermitida = errors.New("a idade do cliente precisa estar entre 18 e 65 anos")

type Situacao string

const (
	Ativo   Situacao = "Ativo"
	Inativo Situacao = "Inativo"
)

type Cliente struct {
	id              int
	nome            string
	idade           int
	email           string
	idContaCorrente int
	situacao        Situacao
}

func Novo(id int, nome string, idade int, email string, idContaCorrente int, ativo bool) (*Cliente, error) {
	if !IdadePermitida(idade) {
		return nil, ErrIdadeNaoPermitida
	}
	situacao := Inativo
	if ativo {
		situacao = Ativo
	}
	return &Cliente{id: id, nome: nome, idade: idade, email: email, idContaCorrente: idContaCorrente, situacao: situacao}, nil
}

func IdadePermitida(idade int) bool     { return idade >= IdadeMinima && idade <= IdadeMaxima }
func (c *Cliente) ID() int              { return c.id }
func (c *Cliente) Nome() string         { return c.nome }
func (c *Cliente) Idade() int           { return c.idade }
func (c *Cliente) Email() string        { return c.email }
func (c *Cliente) IDContaCorrente() int { return c.idContaCorrente }
func (c *Cliente) Situacao() Situacao   { return c.situacao }
func (c *Cliente) EstaAtivo() bool      { return c.situacao == Ativo }
func (c *Cliente) Ativar()              { c.situacao = Ativo }
func (c *Cliente) Desativar()           { c.situacao = Inativo }

func (c *Cliente) DefinirIdade(idade int) error {
	if !IdadePermitida(idade) {
		return ErrIdadeNaoPermitida
	}
	c.idade = idade
	return nil
}
