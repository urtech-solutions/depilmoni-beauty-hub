import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Informe seu email para receber as instruções"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
