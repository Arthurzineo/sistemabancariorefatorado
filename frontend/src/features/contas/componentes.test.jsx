import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CadastroConta from "./CadastroConta.jsx";
import ConsultaConta from "./ConsultaConta.jsx";
import ListaContas from "./ListaContas.jsx";
import Transferencia from "./Transferencia.jsx";

describe("componentes de contas", () => {
  it("oferece formulários e ações acessíveis", () => {
    render(
      <>
        <CadastroConta onCadastrar={() => {}} />
        <ConsultaConta onConsultar={() => {}} />
        <ListaContas
          contas={[{ id: 1, saldo: 100, situacao: "Ativa" }]}
          onAcao={() => {}}
        />
        <Transferencia onTransferir={() => {}} />
      </>,
    );
    expect(screen.getByLabelText("Saldo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ativar conta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Transferir" }),
    ).toBeInTheDocument();
  });

  it("dispara ativar, desativar e remover conta", async () => {
    const user = userEvent.setup();
    const acao = vi.fn();
    render(
      <ListaContas
        contas={[{ id: 1, saldo: 100, situacao: "Ativa" }]}
        onAcao={acao}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Ativar conta" }));
    await user.click(screen.getByRole("button", { name: "Desativar conta" }));
    await user.click(screen.getByRole("button", { name: "Remover conta" }));
    expect(acao).toHaveBeenNthCalledWith(1, 1, "ativar");
    expect(acao).toHaveBeenNthCalledWith(2, 1, "desativar");
    expect(acao).toHaveBeenNthCalledWith(3, 1, "remover");
  });
});
