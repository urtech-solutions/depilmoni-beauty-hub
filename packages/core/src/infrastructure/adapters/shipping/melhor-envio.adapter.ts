import type { Inventory, OrderItem } from "../../../domain/models";

export const melhorEnvioAdapter = {
  async quote({
    postalCode,
    items
  }: {
    postalCode?: string;
    items: OrderItem[];
    inventory: Inventory[];
  }) {
    const quantity = items.reduce((total, item) => total + item.quantity, 0);
    const hasExpress = postalCode?.replace(/\D/g, "").startsWith("01");
    const pac = Number((18.9 + quantity * 1.5).toFixed(2));
    const sedex = Number((29.9 + quantity * 2.2).toFixed(2));

    return [
      {
        id: "pac",
        label: "PAC",
        amount: pac,
        eta: "5 a 8 dias uteis",
        carrier: "Melhor Envio"
      },
      {
        id: "sedex",
        label: hasExpress ? "SEDEX Capital" : "SEDEX",
        amount: sedex,
        eta: hasExpress ? "1 a 2 dias uteis" : "2 a 4 dias uteis",
        carrier: "Melhor Envio"
      }
    ];
  }
};
