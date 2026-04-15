"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@depilmoni/ui";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Erro ao enviar email");
      }
      setSubmitted(true);
      toast.success("Se o email existir, você receberá instruções em instantes");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-base text-foreground">
          Se o email <strong>{email}</strong> estiver cadastrado, enviaremos as instruções para
          redefinir sua senha.
        </p>
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
        />
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar instruções"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Lembrou?{" "}
        <Link href="/login" className="text-foreground underline">
          Voltar
        </Link>
      </p>
    </form>
  );
};
