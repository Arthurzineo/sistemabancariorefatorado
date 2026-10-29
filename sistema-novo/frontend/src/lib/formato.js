const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarMoeda(valor) {
  return moeda.format(Number(valor) || 0).replace("\u00a0", " ");
}
