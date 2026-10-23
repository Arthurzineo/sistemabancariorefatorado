package memory

import (
	"testing"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

func TestBuscarRetornaCopiaQueExigeAtualizar(t *testing.T) {
	r := NovoContaRepositorio()
	original, _ := conta.Nova(1, 100, true)
	if err := r.Adicionar(original); err != nil { t.Fatal(err) }
	buscada, _ := r.Buscar(1)
	buscada.Desativar()
	persistida, _ := r.Buscar(1)
	if !persistida.EstaAtiva() { t.Fatal("mutacao foi persistida sem Atualizar") }
	if err := r.Atualizar(buscada); err != nil { t.Fatal(err) }
}
