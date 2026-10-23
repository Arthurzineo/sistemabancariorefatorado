package sqlite

import (
	"database/sql"
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

type executor interface {
	Exec(string, ...any) (sql.Result, error)
	Query(string, ...any) (*sql.Rows, error)
	QueryRow(string, ...any) *sql.Row
}
type ContaRepositorio struct {
	banco *Banco
	db    executor
}

func NovoContaRepositorio(b *Banco) *ContaRepositorio { return &ContaRepositorio{banco: b, db: b.db} }
func (r *ContaRepositorio) Adicionar(c *conta.ContaCorrente) error {
	_, e := r.db.Exec("INSERT INTO contas(id,saldo,situacao) VALUES(?,?,?)", c.ID(), c.Saldo(), c.Situacao())
	return e
}
func (r *ContaRepositorio) Atualizar(c *conta.ContaCorrente) error {
	res, e := r.db.Exec("UPDATE contas SET saldo=?,situacao=? WHERE id=?", c.Saldo(), c.Situacao(), c.ID())
	if e != nil {
		return e
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("conta nao encontrada")
	}
	return nil
}
func (r *ContaRepositorio) Buscar(id int) (*conta.ContaCorrente, bool) {
	var saldo float64
	var situacao string
	e := r.db.QueryRow("SELECT saldo,situacao FROM contas WHERE id=?", id).Scan(&saldo, &situacao)
	if e != nil {
		return nil, false
	}
	c, e := conta.Nova(id, saldo, situacao == "Ativa")
	return c, e == nil
}
func (r *ContaRepositorio) Remover(id int) bool {
	res, e := r.db.Exec("DELETE FROM contas WHERE id=?", id)
	if e != nil {
		return false
	}
	n, _ := res.RowsAffected()
	return n > 0
}
func (r *ContaRepositorio) Listar() []*conta.ContaCorrente {
	rows, e := r.db.Query("SELECT id,saldo,situacao FROM contas ORDER BY id")
	if e != nil {
		return nil
	}
	defer rows.Close()
	var out []*conta.ContaCorrente
	for rows.Next() {
		var id int
		var saldo float64
		var s string
		if rows.Scan(&id, &saldo, &s) == nil {
			c, _ := conta.Nova(id, saldo, s == "Ativa")
			out = append(out, c)
		}
	}
	return out
}
