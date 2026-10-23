package sqlite

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
)

type ClienteRepositorio struct{ banco *Banco }

func NovoClienteRepositorio(b *Banco) *ClienteRepositorio { return &ClienteRepositorio{b} }
func (r *ClienteRepositorio) Adicionar(c *cliente.Cliente) error {
	_, e := r.banco.db.Exec("INSERT INTO clientes(id,nome,idade,email,id_conta_corrente,situacao) VALUES(?,?,?,?,?,?)", c.ID(), c.Nome(), c.Idade(), c.Email(), c.IDContaCorrente(), c.Situacao())
	return e
}
func (r *ClienteRepositorio) Atualizar(c *cliente.Cliente) error {
	res, e := r.banco.db.Exec("UPDATE clientes SET nome=?,idade=?,email=?,id_conta_corrente=?,situacao=? WHERE id=?", c.Nome(), c.Idade(), c.Email(), c.IDContaCorrente(), c.Situacao(), c.ID())
	if e != nil {
		return e
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("cliente nao encontrado")
	}
	return nil
}
func (r *ClienteRepositorio) Buscar(id int) (*cliente.Cliente, bool) {
	var nome, email, s string
	var idade, conta int
	e := r.banco.db.QueryRow("SELECT nome,idade,email,id_conta_corrente,situacao FROM clientes WHERE id=?", id).Scan(&nome, &idade, &email, &conta, &s)
	if e != nil {
		return nil, false
	}
	c, e := cliente.Novo(id, nome, idade, email, conta, s == "Ativo")
	return c, e == nil
}
func (r *ClienteRepositorio) Remover(id int) bool {
	res, e := r.banco.db.Exec("DELETE FROM clientes WHERE id=?", id)
	if e != nil {
		return false
	}
	n, _ := res.RowsAffected()
	return n > 0
}
func (r *ClienteRepositorio) Listar() []*cliente.Cliente {
	rows, e := r.banco.db.Query("SELECT id,nome,idade,email,id_conta_corrente,situacao FROM clientes ORDER BY id")
	if e != nil {
		return nil
	}
	defer rows.Close()
	var out []*cliente.Cliente
	for rows.Next() {
		var id, idade, conta int
		var nome, email, s string
		if rows.Scan(&id, &nome, &idade, &email, &conta, &s) == nil {
			c, _ := cliente.Novo(id, nome, idade, email, conta, s == "Ativo")
			out = append(out, c)
		}
	}
	return out
}
