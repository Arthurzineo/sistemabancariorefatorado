package conta_test

import (
 "errors"
 "testing"
 app "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
 "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
)
func TestCadastroContaETransferencia(t *testing.T){repo:=memory.NovoContaRepositorio();s:=app.NovoServico(repo);if _,e:=s.Cadastrar(1,100,true);e!=nil{t.Fatal(e)};if _,e:=s.Cadastrar(2,0,true);e!=nil{t.Fatal(e)};if e:=s.Transferir(1,2,30);e!=nil{t.Fatal(e)};c,_:=s.Consultar(1);if c.Saldo()!=70{t.Fatal(c.Saldo())};if _,e:=s.Cadastrar(1,0,true);!errors.Is(e,app.ErrIDDuplicado){t.Fatal(e)}}
