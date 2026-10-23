package seed

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

func Aplicar(clientes ports.ClienteRepository, contas ports.ContaRepository) error {
	for _, v := range []struct {
		id    int
		saldo float64
	}{{1, 100}, {2, 100}} {
		if _, ok := contas.Buscar(v.id); !ok {
			c, err := conta.Nova(v.id, v.saldo, true)
			if err != nil {
				return err
			}
			if e := contas.Adicionar(c); e != nil {
				return e
			}
		}
	}
	for _, v := range []struct {
		id, idade, conta int
		nome, email      string
	}{{1, 31, 1, "Maria Silva", "mariasilva@gmail.com"}, {2, 34, 2, "Felipe Augusto", "felipeaugusto@gmail.com"}} {
		if _, ok := clientes.Buscar(v.id); !ok {
			c, err := cliente.Novo(v.id, v.nome, v.idade, v.email, v.conta, true)
			if err != nil {
				return err
			}
			if e := clientes.Adicionar(c); e != nil {
				return e
			}
		}
	}
	return nil
}
