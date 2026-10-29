package seed

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	sqlrepo "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/sqlite"
	"path/filepath"
	"testing"
)

func TestAplicarEhIdempotenteMemory(t *testing.T) {
	c := memory.NovoClienteRepositorio()
	a := memory.NovoContaRepositorio()
	if e := Aplicar(c, a); e != nil {
		t.Fatal(e)
	}
	if e := Aplicar(c, a); e != nil {
		t.Fatal(e)
	}
	if len(c.Listar()) != 2 || len(a.Listar()) != 2 {
		t.Fatal("seed duplicou")
	}
}
func TestAplicarEhIdempotenteSQLite(t *testing.T) {
	b, e := sqlrepo.Abrir(filepath.Join(t.TempDir(), "b.db"))
	if e != nil {
		t.Fatal(e)
	}
	defer b.Fechar()
	_ = b.Migrar()
	c := sqlrepo.NovoClienteRepositorio(b)
	a := sqlrepo.NovoContaRepositorio(b)
	_ = Aplicar(c, a)
	_ = Aplicar(c, a)
	if len(c.Listar()) != 2 || len(a.Listar()) != 2 {
		t.Fatal("seed duplicou")
	}
}
