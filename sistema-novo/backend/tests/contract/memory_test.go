package contract

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"testing"
)

func TestContratoMemory(t *testing.T) {
	executarContratoConta(t, func(t *testing.T) ports.ContaRepository { return memory.NovoContaRepositorio() })
	executarContratoCliente(t, func(t *testing.T) ports.ClienteRepository { return memory.NovoClienteRepositorio() })
}

func executarContratoClienteNoRepo(t *testing.T, r ports.ClienteRepository) {
	c, _ := cliente.Novo(1, "Ana", 25, "ana@example.com", 1, true)
	if err := r.Adicionar(c); err != nil {
		t.Fatal(err)
	}
	if err := r.Adicionar(c); err == nil {
		t.Fatal("id duplicado aceito")
	}
	buscada, ok := r.Buscar(1)
	if !ok {
		t.Fatal("cliente ausente")
	}
	buscada.Desativar()
	if err := r.Atualizar(buscada); err != nil {
		t.Fatal(err)
	}
	if got, _ := r.Buscar(1); got.EstaAtivo() {
		t.Fatal("atualizacao perdida")
	}
	if !r.Remover(1) {
		t.Fatal("remocao falhou")
	}
}

func executarContratoContaNoRepo(t *testing.T, r ports.ContaRepository) {
	c, _ := conta.Nova(1, 10, true)
	if err := r.Adicionar(c); err != nil {
		t.Fatal(err)
	}
	if err := r.Adicionar(c); err == nil {
		t.Fatal("id duplicado aceito")
	}
	buscada, ok := r.Buscar(1)
	if !ok {
		t.Fatal("conta ausente")
	}
	_ = buscada.DefinirSaldo(20)
	if err := r.Atualizar(buscada); err != nil {
		t.Fatal(err)
	}
	if got, _ := r.Buscar(1); got.Saldo() != 20 {
		t.Fatal("atualizacao perdida")
	}
	if !r.Remover(1) {
		t.Fatal("remocao falhou")
	}
	if _, ok := r.Buscar(1); ok {
		t.Fatal("conta removida encontrada")
	}
}
