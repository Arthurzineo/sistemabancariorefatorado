package sqlite

import (
	"database/sql"
	_ "modernc.org/sqlite"
)

type Banco struct{ db *sql.DB }

func Abrir(origem string) (*Banco, error) {
	db, err := sql.Open("sqlite", origem)
	if err != nil {
		return nil, err
	}
	if _, err = db.Exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;"); err != nil {
		db.Close()
		return nil, err
	}
	return &Banco{db: db}, nil
}

func (b *Banco) Fechar() error { return b.db.Close() }

func (b *Banco) Migrar() error {
	const schema = `
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY, nome TEXT NOT NULL, idade INTEGER NOT NULL,
  email TEXT NOT NULL, id_conta_corrente INTEGER NOT NULL, situacao TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS contas (
  id INTEGER PRIMARY KEY, saldo REAL NOT NULL, situacao TEXT NOT NULL
);`
	_, err := b.db.Exec(schema)
	return err
}
