package memory

import (
	"errors"
	"sync"

	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

var ErrIDDuplicado = errors.New("identificador duplicado")

type ClienteRepositorio struct {
	mu    sync.RWMutex
	dados map[int]*cliente.Cliente
}

func NovoClienteRepositorio() *ClienteRepositorio {
	return &ClienteRepositorio{dados: map[int]*cliente.Cliente{}}
}
func (r *ClienteRepositorio) Adicionar(c *cliente.Cliente) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[c.ID()]; ok {
		return ErrIDDuplicado
	}
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *ClienteRepositorio) Buscar(id int) (*cliente.Cliente, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	c, ok := r.dados[id]
	if !ok {
		return nil, false
	}
	return c.Copia(), true
}
func (r *ClienteRepositorio) Atualizar(c *cliente.Cliente) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[c.ID()]; !ok {
		return errors.New("cliente nao encontrado")
	}
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *ClienteRepositorio) Remover(id int) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[id]; !ok {
		return false
	}
	delete(r.dados, id)
	return true
}
func (r *ClienteRepositorio) Listar() []*cliente.Cliente {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := make([]*cliente.Cliente, 0, len(r.dados))
	for _, c := range r.dados {
		result = append(result, c.Copia())
	}
	return result
}

type ContaRepositorio struct {
	mu    sync.RWMutex
	dados map[int]*conta.ContaCorrente
}

func NovoContaRepositorio() *ContaRepositorio {
	return &ContaRepositorio{dados: map[int]*conta.ContaCorrente{}}
}
func (r *ContaRepositorio) Adicionar(c *conta.ContaCorrente) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[c.ID()]; ok {
		return ErrIDDuplicado
	}
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *ContaRepositorio) AdicionarComSaldo(id int, saldo float64, ativa bool) error {
	c, err := conta.Nova(id, saldo, ativa)
	if err != nil {
		return err
	}
	return r.Adicionar(c)
}
func (r *ContaRepositorio) Buscar(id int) (*conta.ContaCorrente, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	c, ok := r.dados[id]
	if !ok {
		return nil, false
	}
	return c.Copia(), true
}
func (r *ContaRepositorio) Atualizar(c *conta.ContaCorrente) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[c.ID()]; !ok {
		return errors.New("conta nao encontrada")
	}
	r.dados[c.ID()] = c.Copia()
	return nil
}
func (r *ContaRepositorio) Remover(id int) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.dados[id]; !ok {
		return false
	}
	delete(r.dados, id)
	return true
}
func (r *ContaRepositorio) Listar() []*conta.ContaCorrente {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := make([]*conta.ContaCorrente, 0, len(r.dados))
	for _, c := range r.dados {
		result = append(result, c.Copia())
	}
	return result
}
