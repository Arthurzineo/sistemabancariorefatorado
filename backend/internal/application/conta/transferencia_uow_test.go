package conta

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"testing"
)

type repositorioFalhaSegundoUpdate struct {
	dados   map[int]*domain.ContaCorrente
	updates int
}

func (r *repositorioFalhaSegundoUpdate) Adicionar(c *domain.ContaCorrente) error {
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *repositorioFalhaSegundoUpdate) Buscar(id int) (*domain.ContaCorrente, bool) {
	c, ok := r.dados[id]
	if !ok {
		return nil, false
	}
	return c.Copia(), true
}
func (r *repositorioFalhaSegundoUpdate) Atualizar(c *domain.ContaCorrente) error {
	r.updates++
	if r.updates == 2 {
		return errors.New("segunda atualizacao falhou")
	}
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *repositorioFalhaSegundoUpdate) Remover(int) bool                { return false }
func (r *repositorioFalhaSegundoUpdate) Listar() []*domain.ContaCorrente { return nil }
func (r *repositorioFalhaSegundoUpdate) Executar(fn func(ports.ContaRepository) error) error {
	tx := &repositorioFalhaSegundoUpdate{dados: map[int]*domain.ContaCorrente{}}
	for id, c := range r.dados {
		tx.dados[id] = c.Copia()
	}
	if e := fn(tx); e != nil {
		return e
	}
	r.dados = tx.dados
	return nil
}

func TestTransferirNaoPersisteQuandoSegundoAtualizarFalha(t *testing.T) {
	r := &repositorioFalhaSegundoUpdate{dados: map[int]*domain.ContaCorrente{}}
	a, _ := domain.Nova(1, 100, true)
	b, _ := domain.Nova(2, 0, true)
	_ = r.Adicionar(a)
	_ = r.Adicionar(b)
	s := NovoServico(r)
	if e := s.Transferir(1, 2, 40); e == nil {
		t.Fatal("erro esperado")
	}
	a, _ = r.Buscar(1)
	b, _ = r.Buscar(2)
	if a.Saldo() != 100 || b.Saldo() != 0 {
		t.Fatal("saldos persistidos parcialmente")
	}
}
