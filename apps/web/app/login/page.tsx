import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthShell title="Bem-vinda de volta" subtitle="Entre para acessar sua conta Depilmoni">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
