import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusChip } from "./StatusChip.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

describe("componentes base", () => {
  it("expõe situação com ícone e texto", () => {
    render(<StatusChip situacao="Ativa" />);
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByLabelText("Ativa")).toBeInTheDocument();
  });

  it("alterna o tema", async () => {
    render(<ThemeToggle />);
    const botao = screen.getByRole("button", { name: /tema/i });
    botao.click();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
