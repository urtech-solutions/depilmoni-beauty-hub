"use client";

import { useMemo, useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Address } from "@depilmoni/core";
import { Button, Input } from "@depilmoni/ui";

import { AddressInputSchema, type AddressInput } from "@/lib/account-schemas";

const emptyForm: AddressInput = {
  label: "",
  recipientName: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  isDefault: false
};

const sortAddresses = (addresses: Address[]) =>
  [...addresses].sort((left, right) => Number(right.isDefault) - Number(left.isDefault));

type AddressBookProps = {
  initialAddresses: Address[];
};

export const AddressBook = ({ initialAddresses }: AddressBookProps) => {
  const [addresses, setAddresses] = useState(sortAddresses(initialAddresses));
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(
    () => (editingId ? "Editar endereco" : "Novo endereco"),
    [editingId]
  );

  const update =
    (key: keyof AddressInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = key === "isDefault" ? event.target.checked : event.target.value;
      setForm((current) => ({ ...current, [key]: value as never }));
    };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipientName: address.recipientName,
      street: address.street,
      number: address.number,
      complement: address.complement ?? "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = AddressInputSchema.safeParse(form);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Confira o endereco informado");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        editingId ? `/api/customer/addresses/${editingId}` : "/api/customer/addresses",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data)
        }
      );

      const json = (await response.json()) as { error?: string; address?: Address };

      if (!response.ok || !json.address) {
        throw new Error(json.error ?? "Falha ao salvar endereco");
      }

      setAddresses((current) => {
        const next = editingId
          ? current.map((item) => (item.id === editingId ? json.address! : item))
          : [json.address!, ...current];

        if (json.address!.isDefault) {
          return sortAddresses(
            next.map((item) => ({
              ...item,
              isDefault: item.id === json.address!.id
            }))
          );
        }

        return sortAddresses(next);
      });

      reset();
      toast.success(editingId ? "Endereco atualizado" : "Endereco criado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar endereco");
    } finally {
      setSubmitting(false);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/customer/addresses/${id}`, { method: "DELETE" });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao remover endereco");
      }

      setAddresses((current) => current.filter((item) => item.id !== id));
      if (editingId === id) reset();
      toast.success("Endereco removido");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao remover endereco");
    }
  };

  const setDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/customer/addresses/${id}/default`, { method: "POST" });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao definir endereco padrao");
      }

      setAddresses((current) =>
        sortAddresses(
          current.map((item) => ({
            ...item,
            isDefault: item.id === id
          }))
        )
      );
      toast.success("Endereco padrao atualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao definir endereco padrao");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        {addresses.length ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{address.label}</span>
                    {address.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(201,157,84,0.16)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-accent-gold)]">
                        <Star size={12} />
                        Padrao
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-foreground">{address.recipientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.number}
                    {address.complement ? `, ${address.complement}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood} · {address.city}/{address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">CEP {address.zipCode}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!address.isDefault ? (
                    <Button variant="outline" size="sm" onClick={() => setDefault(address.id)}>
                      <Star size={14} />
                      Tornar padrao
                    </Button>
                  ) : null}
                  <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
                    <Pencil size={14} />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeAddress(address.id)}>
                    <Trash2 size={14} />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-border/70 bg-card p-6 text-sm text-muted-foreground">
            Nenhum endereco salvo ainda. Cadastre o primeiro para agilizar o checkout.
          </div>
        )}
      </div>

      <div className="rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-copper/10 text-copper">
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              Organize seus pontos de entrega
            </h3>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rótulo</label>
              <Input value={form.label} onChange={update("label")} placeholder="Casa, Studio, Loja" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quem recebe</label>
              <Input value={form.recipientName} onChange={update("recipientName")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_160px]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rua</label>
              <Input value={form.street} onChange={update("street")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Numero</label>
              <Input value={form.number} onChange={update("number")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Complemento</label>
            <Input value={form.complement ?? ""} onChange={update("complement")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bairro</label>
              <Input value={form.neighborhood} onChange={update("neighborhood")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cidade</label>
              <Input value={form.city} onChange={update("city")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">UF</label>
              <Input value={form.state} onChange={update("state")} maxLength={2} placeholder="CE" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CEP</label>
              <Input value={form.zipCode} onChange={update("zipCode")} placeholder="60000-000" />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={update("isDefault")}
              className="h-4 w-4 rounded border-border"
            />
            Definir como endereco padrao para o checkout
          </label>

          <div className="flex flex-wrap justify-end gap-3">
            {editingId ? (
              <Button type="button" variant="ghost" onClick={reset}>
                Cancelar
              </Button>
            ) : null}
            <Button type="submit" variant="hero" size="lg" disabled={submitting}>
              <MapPin size={16} />
              {submitting ? "Salvando..." : editingId ? "Atualizar endereco" : "Salvar endereco"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
