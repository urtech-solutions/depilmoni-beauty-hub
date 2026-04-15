import { Card } from "@depilmoni/ui";

import { ProfileForm } from "@/components/account/profile-form";
import { getCurrentUser } from "@/lib/account-server";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  return (
    <Card className="space-y-6 border border-border bg-card p-6 md:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Perfil</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Seus dados de atendimento
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Mantenha suas informações atualizadas para pedidos, contato da equipe e ofertas por perfil.
        </p>
      </div>

      <ProfileForm user={user} />
    </Card>
  );
}
