package cliente_test

import (
	"errors"
	"testing"
	app "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
)
func TestSituacaoDistingueClienteInexistenteDeInativo(t *testing.T){s:=app.NovoServico(memory.NovoClienteRepositorio());if _,e:=s.Situacao(99);!errors.Is(e,app.ErrClienteNaoEncontrado){t.Fatal(e)};if _,e:=s.Cadastrar(1,"Ana",25,"a@e",1,false);e!=nil{t.Fatal(e)};situacao,e:=s.Situacao(1);if e!=nil||situacao!="Inativo"{t.Fatalf("%q %v",situacao,e)}}
