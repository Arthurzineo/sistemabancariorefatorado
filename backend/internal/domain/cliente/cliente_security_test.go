package cliente

import "testing"

func TestNovoRecusaIdentificadorNomeEEmailInvalidos(t *testing.T) {
	casos := []struct {
		id          int
		nome, email string
	}{{0, "Ana", "ana@example.com"}, {1, " ", "ana@example.com"}, {1, "Ana", "invalido"}}
	for _, caso := range casos {
		if _, err := Novo(caso.id, caso.nome, 25, caso.email, 1, true); err == nil {
			t.Fatalf("entrada inválida aceita: %+v", caso)
		}
	}
}
