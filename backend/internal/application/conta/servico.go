package conta

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

var (
	ErrIDDuplicado        = errors.New("identificador duplicado")
	ErrContaNaoEncontrada = errors.New("conta nao encontrada")
)

type Servico struct {
	repositorio ports.ContaRepository
	uow         ports.UnitOfWork
}

func NovoServico(repositorio ports.ContaRepository) *Servico {
	s := &Servico{repositorio: repositorio}
	if uow, ok := repositorio.(ports.UnitOfWork); ok {
		s.uow = uow
	}
	return s
}
func (s *Servico) Cadastrar(id int, saldo float64, ativa bool) (*domain.ContaCorrente, error) {
	if _, ok := s.repositorio.Buscar(id); ok {
		return nil, ErrIDDuplicado
	}
	c, e := domain.Nova(id, saldo, ativa)
	if e != nil {
		return nil, e
	}
	if e = s.repositorio.Adicionar(c); e != nil {
		return nil, ErrIDDuplicado
	}
	return c, nil
}
func (s *Servico) Consultar(id int) (*domain.ContaCorrente, error) {
	c, ok := s.repositorio.Buscar(id)
	if !ok {
		return nil, ErrContaNaoEncontrada
	}
	return c, nil
}
func (s *Servico) Remover(id int) error {
	if !s.repositorio.Remover(id) {
		return ErrContaNaoEncontrada
	}
	return nil
}
func (s *Servico) Ativar(id int) error {
	c, e := s.Consultar(id)
	if e != nil {
		return e
	}
	c.Ativar()
	return s.repositorio.Atualizar(c)
}
func (s *Servico) Desativar(id int) error {
	c, e := s.Consultar(id)
	if e != nil {
		return e
	}
	c.Desativar()
	return s.repositorio.Atualizar(c)
}
func (s *Servico) Transferir(origemID, destinoID int, valor float64) error {
	if s.uow == nil {
		return errors.New("unit of work obrigatoria para transferencia")
	}
	return s.uow.Executar(func(repo ports.ContaRepository) error {
		origem, ok := repo.Buscar(origemID)
		if !ok {
			return domain.ErrContaOrigemNaoEncontrada
		}
		destino, ok := repo.Buscar(destinoID)
		if !ok {
			return domain.ErrContaDestinoNaoEncontrada
		}
		if err := domain.Transferir(origem, destino, valor); err != nil {
			return err
		}
		if err := repo.Atualizar(origem); err != nil {
			return err
		}
		return repo.Atualizar(destino)
	})
}

func (s *Servico) Situacao(id int) (domain.Situacao, error) {
	c, err := s.Consultar(id)
	if err != nil {
		return "", err
	}
	return c.Situacao(), nil
}
func (s *Servico) Listar() []*domain.ContaCorrente { return s.repositorio.Listar() }
