package memory

import (
	"testing"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
)

func TestListarRetornaCopiaDoSlice(t *testing.T) {
	r := NovoClienteRepositorio()
	c, _ := cliente.Novo(1, "Ana", 25, "ana@example.com", 1, true)
	if err := r.Adicionar(c); err != nil { t.Fatal(err) }
	lista := r.Listar()
	lista[0].Desativar()
	if !r.Listar()[0].EstaAtivo() { t.Fatal("listagem expôs entidade interna") }
}
