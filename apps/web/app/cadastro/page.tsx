import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="Cadastre-se para acompanhar pedidos, ganhar XP e desbloquear benefícios"
    >
      <RegisterForm />
    </AuthShell>
  );
}
