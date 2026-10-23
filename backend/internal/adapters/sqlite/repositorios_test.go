package sqlite

import "testing"

func TestAbreBancoEMigraSchema(t *testing.T) {
	banco, err := Abrir(":memory:")
	if err != nil {
		t.Fatal(err)
	}
	defer banco.Fechar()
	if err := banco.Migrar(); err != nil {
		t.Fatal(err)
	}
}
