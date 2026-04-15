"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@depilmoni/ui";

import { useAuthStore } from "@/store/auth-store";

export const RegisterForm = () => {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    cpf: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        cpf: form.cpf || undefined
      });
      toast.success("Conta criada com sucesso!");
      router.push("/minha-conta");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar conta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome completo
        </label>
        <Input id="name" required value={form.name} onChange={update("name")} placeholder="Como devemos te chamar?" />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
          placeholder="voce@exemplo.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={update("password")}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefone (opcional)
          </label>
          <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="(11) 99999-0000" />
        </div>
        <div className="space-y-2">
          <label htmlFor="cpf" className="text-sm font-medium text-foreground">
            CPF (opcional)
          </label>
          <Input id="cpf" value={form.cpf} onChange={update("cpf")} placeholder="000.000.000-00" />
        </div>
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-foreground underline">
          Entrar
        </Link>
      </p>
    </form>
  );
};
