package cliente

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
)

var (
	ErrIDDuplicado          = errors.New("identificador duplicado")
	ErrClienteNaoEncontrado = errors.New("cliente nao encontrado")
)

type Servico struct{ repositorio ports.ClienteRepository }

func NovoServico(repositorio ports.ClienteRepository) *Servico { return &Servico{repositorio} }
func (s *Servico) Cadastrar(id int, nome string, idade int, email string, idConta int, ativo bool) (*domain.Cliente, error) {
	if _, ok := s.repositorio.Buscar(id); ok {
		return nil, ErrIDDuplicado
	}
	c, err := domain.Novo(id, nome, idade, email, idConta, ativo)
	if err != nil {
		return nil, err
	}
	if err := s.repositorio.Adicionar(c); err != nil {
		return nil, ErrIDDuplicado
	}
	return c, nil
}
func (s *Servico) Consultar(id int) (*domain.Cliente, error) {
	c, ok := s.repositorio.Buscar(id)
	if !ok {
		return nil, ErrClienteNaoEncontrado
	}
	return c, nil
}
func (s *Servico) Remover(id int) error {
	if !s.repositorio.Remover(id) {
		return ErrClienteNaoEncontrado
	}
	return nil
}
func (s *Servico) Ativar(id int) error {
	c, e := s.Consultar(id)
	if e != nil {
		return e
	}
	c.Ativar()
	return nil
}
func (s *Servico) Desativar(id int) error {
	c, e := s.Consultar(id)
	if e != nil {
		return e
	}
	c.Desativar()
	return nil
}
func (s *Servico) Situacao(id int) (domain.Situacao, error) {
	c, err := s.Consultar(id)
	if err != nil {
		return "", err
	}
	return c.Situacao(), nil
}
