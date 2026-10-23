package sqlite

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"testing"
)

func TestContaRepositorioPersisteAtualizacao(t *testing.T) {
	b, e := Abrir(":memory:")
	if e != nil {
		t.Fatal(e)
	}
	defer b.Fechar()
	if e = b.Migrar(); e != nil {
		t.Fatal(e)
	}
	r := NovoContaRepositorio(b)
	c, _ := conta.Nova(1, 10, true)
	if e = r.Adicionar(c); e != nil {
		t.Fatal(e)
	}
	c, _ = r.Buscar(1)
	_ = c.DefinirSaldo(20)
	if e = r.Atualizar(c); e != nil {
		t.Fatal(e)
	}
	c, _ = r.Buscar(1)
	if c.Saldo() != 20 {
		t.Fatal(c.Saldo())
	}
}
