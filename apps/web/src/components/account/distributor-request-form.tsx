"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@depilmoni/ui";

import {
  DistributorRequestInputSchema,
  type DistributorRequestInput
} from "@/lib/account-schemas";

const initialForm: DistributorRequestInput = {
  responsibleName: "",
  companyName: "",
  tradeName: "",
  cnpj: "",
  stateRegistration: "",
  phone: "",
  commercialAddress: {
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: ""
  },
  website: "",
  socialMedia: "",
  observations: "",
  termsAccepted: true
};

type DistributorRequestFormProps = {
  compact?: boolean;
};

export const DistributorRequestForm = ({
  compact = false
}: DistributorRequestFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof DistributorRequestInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        key === "termsAccepted" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;
      setForm((current) => ({ ...current, [key]: value as never }));
    };

  const updateAddress =
    (key: keyof DistributorRequestInput["commercialAddress"]) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        commercialAddress: {
          ...current.commercialAddress,
          [key]: event.target.value
        }
      }));
    };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = DistributorRequestInputSchema.safeParse(form);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Confira os dados da solicitacao");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/distributor/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });

      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao enviar solicitacao");
      }

      toast.success("Solicitação enviada para análise");
      router.push("/minha-conta/distribuidor");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao enviar solicitacao");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Responsável</label>
          <Input value={form.responsibleName} onChange={update("responsibleName")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Telefone comercial</label>
          <Input value={form.phone} onChange={update("phone")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Razão social</label>
          <Input value={form.companyName} onChange={update("companyName")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome fantasia</label>
          <Input value={form.tradeName} onChange={update("tradeName")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">CNPJ</label>
          <Input value={form.cnpj} onChange={update("cnpj")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Inscrição estadual</label>
          <Input value={form.stateRegistration ?? ""} onChange={update("stateRegistration")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_160px]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rua comercial</label>
          <Input value={form.commercialAddress.street} onChange={updateAddress("street")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Número</label>
          <Input value={form.commercialAddress.number ?? ""} onChange={updateAddress("number")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bairro</label>
          <Input value={form.commercialAddress.neighborhood ?? ""} onChange={updateAddress("neighborhood")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cidade</label>
          <Input value={form.commercialAddress.city} onChange={updateAddress("city")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">UF</label>
          <Input value={form.commercialAddress.state} onChange={updateAddress("state")} maxLength={2} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">CEP</label>
          <Input value={form.commercialAddress.zipCode} onChange={updateAddress("zipCode")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Website</label>
          <Input value={form.website ?? ""} onChange={update("website")} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Instagram / rede social</label>
        <Input value={form.socialMedia ?? ""} onChange={update("socialMedia")} placeholder="@depilmoni" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Observações</label>
        <textarea
          value={form.observations ?? ""}
          onChange={update("observations")}
          rows={compact ? 4 : 5}
          className="flex w-full rounded-[24px] border border-border/80 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-copper/50"
          placeholder="Conte um pouco sobre sua operação, região de atuação e volume estimado."
        />
      </div>

      <label className="flex items-start gap-3 rounded-[24px] border border-border/70 px-4 py-4 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.termsAccepted}
          onChange={update("termsAccepted")}
          className="mt-1 h-4 w-4 rounded border-border"
        />
        <span>
          Confirmo que as informações comerciais são verdadeiras e autorizo o contato da equipe
          Depilmoni para análise do cadastro.
        </span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" variant="hero" size="lg" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar solicitacao"}
        </Button>
      </div>
    </form>
  );
};
