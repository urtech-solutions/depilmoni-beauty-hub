import { z } from "zod";

const emptyToUndefined = (value: string | undefined) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome completo"),
  phone: z.string().optional().transform(emptyToUndefined),
  cpf: z.string().optional().transform(emptyToUndefined)
});

export const AddressInputSchema = z.object({
  label: z.string().trim().min(2, "Informe um rótulo para o endereço"),
  recipientName: z.string().trim().min(2, "Informe quem recebe"),
  street: z.string().trim().min(2, "Informe a rua"),
  number: z.string().trim().min(1, "Informe o número"),
  complement: z.string().optional().transform(emptyToUndefined),
  neighborhood: z.string().trim().min(2, "Informe o bairro"),
  city: z.string().trim().min(2, "Informe a cidade"),
  state: z.string().trim().min(2, "Informe o estado").max(2, "Use a sigla do estado"),
  zipCode: z.string().trim().min(8, "Informe o CEP"),
  isDefault: z.boolean().default(false)
});

export const DistributorRequestInputSchema = z.object({
  responsibleName: z.string().trim().min(2, "Informe o responsável"),
  companyName: z.string().trim().min(2, "Informe a razão social"),
  tradeName: z.string().trim().min(2, "Informe o nome fantasia"),
  cnpj: z.string().trim().min(14, "Informe o CNPJ"),
  stateRegistration: z.string().optional().transform(emptyToUndefined),
  phone: z.string().trim().min(8, "Informe o telefone comercial"),
  commercialAddress: z.object({
    street: z.string().trim().min(2, "Informe a rua"),
    number: z.string().optional().transform(emptyToUndefined),
    neighborhood: z.string().optional().transform(emptyToUndefined),
    city: z.string().trim().min(2, "Informe a cidade"),
    state: z.string().trim().min(2, "Informe o estado").max(2, "Use a sigla do estado"),
    zipCode: z.string().trim().min(8, "Informe o CEP")
  }),
  website: z.string().optional().transform(emptyToUndefined),
  socialMedia: z.string().optional().transform(emptyToUndefined),
  observations: z.string().optional().transform(emptyToUndefined),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar os termos para enviar a solicitação" })
  })
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type AddressInput = z.infer<typeof AddressInputSchema>;
export type DistributorRequestInput = z.infer<typeof DistributorRequestInputSchema>;
