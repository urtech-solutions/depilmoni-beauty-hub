"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@depilmoni/ui";

import { ProfileUpdateSchema } from "@/lib/account-schemas";
import type { StorefrontUser } from "@/lib/payload-client";
import { useAuthStore } from "@/store/auth-store";

type ProfileFormProps = {
  user: StorefrontUser;
};

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const router = useRouter();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    cpf: user.cpf ?? ""
  });
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = ProfileUpdateSchema.safeParse({
      name: form.name,
      phone: form.phone,
      cpf: form.cpf
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Confira os dados do perfil");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });

      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao atualizar perfil");
      }

      await refreshAuth();
      router.refresh();
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar perfil");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome completo
          </label>
          <Input id="name" value={form.name} onChange={update("name")} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input id="email" value={form.email} disabled className="cursor-not-allowed opacity-70" />
          <p className="text-xs text-muted-foreground">O email nao pode ser alterado pelo portal.</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefone
          </label>
          <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="(85) 99999-0000" />
        </div>

        <div className="space-y-2">
          <label htmlFor="cpf" className="text-sm font-medium text-foreground">
            CPF
          </label>
          <Input id="cpf" value={form.cpf} onChange={update("cpf")} placeholder="000.000.000-00" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="hero" size="lg" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar perfil"}
        </Button>
      </div>
    </form>
  );
};
