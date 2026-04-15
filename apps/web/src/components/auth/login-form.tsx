"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@depilmoni/ui";

import { useAuthStore } from "@/store/auth-store";

export const LoginForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = params.get("next") ?? "/minha-conta";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Bem-vinda de volta!");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao entrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Entrando..." : "Entrar"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/esqueci-senha" className="text-muted-foreground hover:text-foreground">
          Esqueci minha senha
        </Link>
        <Link href="/cadastro" className="text-muted-foreground hover:text-foreground">
          Criar conta
        </Link>
      </div>
    </form>
  );
};
