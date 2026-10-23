package ports

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

type ClienteRepository interface {
	Adicionar(*cliente.Cliente) error
	Buscar(int) (*cliente.Cliente, bool)
	Remover(int) bool
	Listar() []*cliente.Cliente
}

type ContaRepository interface {
	Adicionar(*conta.ContaCorrente) error
	Buscar(int) (*conta.ContaCorrente, bool)
	Remover(int) bool
	Listar() []*conta.ContaCorrente
}
