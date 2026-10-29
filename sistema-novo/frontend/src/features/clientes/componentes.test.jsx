import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../tests/server.js";
import CadastroCliente from "./CadastroCliente.jsx";
import ConsultaCliente from "./ConsultaCliente.jsx";
import ValidacaoIdade from "./ValidacaoIdade.jsx";
import ListaClientes from "./ListaClientes.jsx";
import AcoesCliente from "./AcoesCliente.jsx";
import Clientes from "./Clientes.jsx";

describe("componentes de clientes", () => {
  it("oferece campos e ações acessíveis", () => {
    render(
      <>
        <CadastroCliente onCadastrar={() => {}} />
        <ConsultaCliente onConsultar={() => {}} />
        <ValidacaoIdade onValidar={() => {}} />
        <ListaClientes
          clientes={[{ id: 1, nome: "Ana", situacao: "Ativo" }]}
          renderAcoes={() => (
            <AcoesCliente situacao="Ativo" onAcao={() => {}} />
          )}
        />
      </>,
    );
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Consultar cliente" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Validar idade" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Desativar" }),
    ).toBeInTheDocument();
  });

  it("dispara ativar, desativar e remover", async () => {
    const user = userEvent.setup();
    const acao = vi.fn();
    render(<AcoesCliente situacao="Ativo" onAcao={acao} />);
    await user.click(screen.getByRole("button", { name: "Remover" }));
    expect(acao).toHaveBeenCalledWith("remover");
  });

  it("carrega a lista e executa ativar, desativar, situação e remoção", async () => {
    const user = userEvent.setup();
    render(<Clientes />);
    expect(await screen.findByText("Ana")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Desativar" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Operação concluída",
    );
    await user.click(screen.getByRole("button", { name: "Ver situação" }));
    await user.click(screen.getByRole("button", { name: "Remover" }));
  });

  it("cadastra cliente e envia id, idade e idContaCorrente numéricos", async () => {
    let corpo;
    server.use(
      http.post("/api/clientes", async ({ request }) => {
        corpo = await request.json();
        return HttpResponse.json(
          { ...corpo, situacao: "Ativo" },
          { status: 201 },
        );
      }),
    );
    const user = userEvent.setup();
    render(<Clientes />);
    const form = screen
      .getByRole("heading", { name: "Cadastrar cliente" })
      .closest("form");
    await user.type(within(form).getByLabelText("ID"), "2");
    await user.type(within(form).getByLabelText("Nome"), "Bia");
    await user.type(within(form).getByLabelText("Idade"), "30");
    await user.type(within(form).getByLabelText("E-mail"), "bia@ex.com");
    await user.type(within(form).getByLabelText("ID da conta corrente"), "5");
    await user.click(
      within(form).getByRole("button", { name: "Cadastrar cliente" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Cliente cadastrado",
    );
    expect(corpo).toMatchObject({ id: 2, idade: 30, idContaCorrente: 5 });
  });
  it("mostra id_duplicado ao cadastrar cliente repetido", async () => {
    server.use(
      http.post("/api/clientes", () =>
        HttpResponse.json(
          { erro: "id_duplicado", mensagem: "id_duplicado" },
          { status: 409 },
        ),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Cadastrar cliente" })
      .closest("form");
    for (const [l, v] of [
      ["ID", "1"],
      ["Nome", "Ana"],
      ["Idade", "25"],
      ["E-mail", "a@a.com"],
      ["ID da conta corrente", "1"],
    ])
      await user.type(within(f).getByLabelText(l), v);
    await user.click(
      within(f).getByRole("button", { name: "Cadastrar cliente" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("id_duplicado");
  });
  it("mostra idade_nao_permitida ao cadastrar menor de 18", async () => {
    server.use(
      http.post("/api/clientes", () =>
        HttpResponse.json(
          { erro: "idade_nao_permitida", mensagem: "idade_nao_permitida" },
          { status: 422 },
        ),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Cadastrar cliente" })
      .closest("form");
    for (const [l, v] of [
      ["ID", "1"],
      ["Nome", "Ana"],
      ["Idade", "17"],
      ["E-mail", "a@a.com"],
      ["ID da conta corrente", "1"],
    ])
      await user.type(within(f).getByLabelText(l), v);
    await user.click(
      within(f).getByRole("button", { name: "Cadastrar cliente" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "idade_nao_permitida",
    );
  });
  it("consulta cliente existente e exibe nome e situação", async () => {
    server.use(
      http.get("/api/clientes/2", () =>
        HttpResponse.json({ id: 2, nome: "Bia", situacao: "Ativo" }),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Consultar cliente" })
      .closest("form");
    await user.type(within(f).getByLabelText("ID do cliente"), "2");
    await user.click(
      within(f).getByRole("button", { name: "Consultar cliente" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Bia — Ativo");
  });
  it("mostra cliente_nao_encontrado ao consultar id inexistente", async () => {
    server.use(
      http.get("/api/clientes/99", () =>
        HttpResponse.json(
          {
            erro: "cliente_nao_encontrado",
            mensagem: "cliente_nao_encontrado",
          },
          { status: 404 },
        ),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Consultar cliente" })
      .closest("form");
    await user.type(within(f).getByLabelText("ID do cliente"), "99");
    await user.click(
      within(f).getByRole("button", { name: "Consultar cliente" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "cliente_nao_encontrado",
    );
  });
  it("informa idade 18 permitida", async () => {
    server.use(
      http.get("/api/clientes/validacao-idade", () =>
        HttpResponse.json({
          idade: 18,
          permitida: true,
          mensagem: "idade permitida",
        }),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Validar idade" })
      .closest("form");
    await user.type(within(f).getByLabelText("Idade para validar"), "18");
    await user.click(within(f).getByRole("button", { name: "Validar idade" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "idade permitida",
    );
  });
  it("informa idade 66 não permitida", async () => {
    server.use(
      http.get("/api/clientes/validacao-idade", () =>
        HttpResponse.json({
          idade: 66,
          permitida: false,
          mensagem: "idade não permitida",
        }),
      ),
    );
    render(<Clientes />);
    const user = userEvent.setup();
    const f = screen
      .getByRole("heading", { name: "Validar idade" })
      .closest("form");
    await user.type(within(f).getByLabelText("Idade para validar"), "66");
    await user.click(within(f).getByRole("button", { name: "Validar idade" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "idade não permitida",
    );
  });
});
