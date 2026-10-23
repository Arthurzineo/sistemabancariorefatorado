import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CadastroCliente from "./CadastroCliente.jsx";
import ConsultaCliente from "./ConsultaCliente.jsx";
import ValidacaoIdade from "./ValidacaoIdade.jsx";
import ListaClientes from "./ListaClientes.jsx";
import AcoesCliente from "./AcoesCliente.jsx";

describe("componentes de clientes", () => {
  it("oferece campos e ações acessíveis", () => {
    render(
      <>
        <CadastroCliente onCadastrar={() => {}} />
        <ConsultaCliente onConsultar={() => {}} />
        <ValidacaoIdade onValidar={() => {}} />
        <ListaClientes
          clientes={[{ id: 1, nome: "Ana", situacao: "Ativo" }]}
          renderAcoes={() => <AcoesCliente onAcao={() => {}} />}
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
    render(<AcoesCliente onAcao={acao} />);
    await user.click(screen.getByRole("button", { name: "Ativar" }));
    await user.click(screen.getByRole("button", { name: "Desativar" }));
    await user.click(screen.getByRole("button", { name: "Remover" }));
    expect(acao).toHaveBeenNthCalledWith(1, "ativar");
    expect(acao).toHaveBeenNthCalledWith(2, "desativar");
    expect(acao).toHaveBeenNthCalledWith(3, "remover");
  });
});
