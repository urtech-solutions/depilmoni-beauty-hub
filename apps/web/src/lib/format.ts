export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long"
  }).format(new Date(value));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
