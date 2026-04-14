export const mercadoPagoAdapter = {
  async charge({
    amount,
    method
  }: {
    amount: number;
    method: "credit-card" | "pix";
  }) {
    return {
      status: "approved" as const,
      provider: "mercado-pago",
      paymentMethod: method,
      amount,
      transactionId: `mp_${Math.random().toString(36).slice(2, 10)}`
    };
  },
  installments(amount: number) {
    return Array.from({ length: 6 }, (_, index) => {
      const count = index + 1;

      return {
        label: `${count}x de R$ ${(amount / count).toFixed(2)}`,
        amount: Number((amount / count).toFixed(2))
      };
    });
  }
};
