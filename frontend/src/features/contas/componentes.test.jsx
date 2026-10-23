import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
