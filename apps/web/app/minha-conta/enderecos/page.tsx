import { Card } from "@depilmoni/ui";

import { AddressBook } from "@/components/account/address-book";
import { listAddressesForCurrentUser } from "@/lib/account-server";

export default async function EnderecosPage() {
  const addresses = await listAddressesForCurrentUser();

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Enderecos</p>
        <h2 className="font-display text-3xl font-semibold text-foreground">Entrega com menos atrito</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Salve pontos de entrega favoritos para agilizar o checkout e a operação comercial.
        </p>
      </Card>

      <AddressBook initialAddresses={addresses} />
    </div>
  );
}
