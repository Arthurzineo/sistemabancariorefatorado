package bdd

import (
	"context"
	"errors"
	"fmt"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	"github.com/cucumber/godog"
	"strconv"
	"strings"
	"testing"
)

func TestFeatures(t *testing.T) {
	suite := godog.TestSuite{Name: "bancario", ScenarioInitializer: inicializarCenario, Options: &godog.Options{Format: "pretty", Paths: []string{"../../features"}, TestingT: t}}
	if suite.Run() != 0 {
		t.Fatal("cenarios BDD falharam")
	}
}

type mundo struct {
	clientes      *clienteapp.Servico
	contas        *contaapp.Servico
	clienteNome   string
	contaID       int
	operacao      error
	transferencia error
}

func inicializarCenario(ctx *godog.ScenarioContext) {
	m := &mundo{}
	ctx.Before(func(context.Context, *godog.Scenario) (context.Context, error) {
		m.clientes = clienteapp.NovoServico(memory.NovoClienteRepositorio())
		m.contas = contaapp.NovoServico(memory.NovoContaRepositorio())
		m.operacao = nil
		m.transferencia = nil
		return context.Background(), nil
	})
	ctx.Step(`^que existe um cliente cadastrado com id (\d+) e nome "([^"]*)"$`, m.cliente)
	ctx.Step(`^que não existe cliente cadastrado com id (\d+)$`, func(id int) {})
	ctx.Step(`^que o cliente de id (\d+) está (ativo|inativo)$`, m.situacaoCliente)
	ctx.Step(`^for solicitada a ativação do cliente de id (\d+)$`, func(id int) { m.operacao = m.clientes.Ativar(id) })
	ctx.Step(`^for solicitada a desativação do cliente de id (\d+)$`, func(id int) { m.operacao = m.clientes.Desativar(id) })
	ctx.Step(`^a operação deverá ser concluída com sucesso$`, func() error { return m.operacao })
	ctx.Step(`^a operação deverá ser rejeitada$`, func() error {
		if m.operacao == nil {
			return errors.New("operacao deveria falhar")
		}
		return nil
	})
	ctx.Step(`^o cliente de id (\d+) deverá ficar (ativo|inativo)$`, m.verificaCliente)
	ctx.Step(`^o operador consultar o cliente de id (\d+)$`, func(id int) {
		c, e := m.clientes.Consultar(id)
		m.operacao = e
		if e == nil {
			m.clienteNome = c.Nome()
		}
	})
	ctx.Step(`^o sistema deverá retornar o cliente "([^"]*)"$`, func(nome string) error {
		if m.clienteNome != nome {
			return fmt.Errorf("cliente %q", m.clienteNome)
		}
		return nil
	})
	ctx.Step(`^o sistema deverá informar que o cliente não foi encontrado$`, func() error {
		if !errors.Is(m.operacao, clienteapp.ErrClienteNaoEncontrado) {
			return fmt.Errorf("erro %v", m.operacao)
		}
		return nil
	})
	ctx.Step(`^que existe uma conta corrente cadastrada com id (\d+) e saldo ([\d,]+)$`, m.conta)
	ctx.Step(`^que não existe conta corrente cadastrada com id (\d+)$`, func(id int) {})
	ctx.Step(`^que a conta de id (\d+) está inativa$`, func(id int) { m.operacao = m.contas.Desativar(id) })
	ctx.Step(`^o operador consultar a conta de id (\d+)$`, func(id int) { _, m.operacao = m.contas.Consultar(id); m.contaID = id })
	ctx.Step(`^o sistema deverá retornar a conta de id (\d+)$`, func(id int) error {
		if m.operacao != nil || m.contaID != id {
			return fmt.Errorf("conta nao retornada")
		}
		return nil
	})
	ctx.Step(`^o saldo exibido deverá ser ([\d,]+)$`, m.saldo)
	ctx.Step(`^a situação exibida deverá ser "([^"]*)"$`, m.situacaoConta)
	ctx.Step(`^o sistema deverá informar que a conta não foi encontrada$`, func() error {
		if !errors.Is(m.operacao, contaapp.ErrContaNaoEncontrada) {
			return fmt.Errorf("erro %v", m.operacao)
		}
		return nil
	})
	ctx.Step(`^for solicitada a transferência de ([\d,-]+) da conta (\d+) para a conta (\d+)$`, func(valor string, origem, destino int) {
		m.transferencia = m.contas.Transferir(origem, destino, numero(valor))
	})
	ctx.Step(`^a transferência deverá ser realizada$`, func() error { return m.transferencia })
	ctx.Step(`^a transferência deverá ser rejeitada$`, func() error {
		if m.transferencia == nil {
			return errors.New("transferencia deveria falhar")
		}
		return nil
	})
	ctx.Step(`^o saldo da conta (\d+) deverá ser ([\d,]+)$`, func(id int, valor string) error {
		c, e := m.contas.Consultar(id)
		if e != nil {
			return e
		}
		if c.Saldo() != numero(valor) {
			return fmt.Errorf("saldo %v", c.Saldo())
		}
		return nil
	})
}
func (m *mundo) cliente(id int, nome string) {
	_, m.operacao = m.clientes.Cadastrar(id, nome, 30, "maria@example.com", id, true)
}
func (m *mundo) situacaoCliente(id int, s string) {
	if s == "ativo" {
		m.operacao = m.clientes.Ativar(id)
	} else {
		m.operacao = m.clientes.Desativar(id)
	}
}
func (m *mundo) verificaCliente(id int, s string) error {
	c, e := m.clientes.Consultar(id)
	if e != nil {
		return e
	}
	if (s == "ativo") != c.EstaAtivo() {
		return fmt.Errorf("situacao incorreta")
	}
	return nil
}
func (m *mundo) conta(id int, saldo string) {
	_, m.operacao = m.contas.Cadastrar(id, numero(saldo), true)
}
func (m *mundo) saldo(valor string) error {
	c, e := m.contas.Consultar(m.contaID)
	if e != nil {
		return e
	}
	if c.Saldo() != numero(valor) {
		return fmt.Errorf("saldo %v", c.Saldo())
	}
	return nil
}
func (m *mundo) situacaoConta(s string) error {
	c, e := m.contas.Consultar(m.contaID)
	if e != nil {
		return e
	}
	if string(c.Situacao()) != s {
		return fmt.Errorf("situacao %s", c.Situacao())
	}
	return nil
}
func numero(s string) float64 {
	v, _ := strconv.ParseFloat(strings.ReplaceAll(s, ",", "."), 64)
	return v
}
