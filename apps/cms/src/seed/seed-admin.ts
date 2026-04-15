/**
 * Bootstraps the first admin user from environment variables.
 *
 * Required env vars:
 *   PAYLOAD_ADMIN_EMAIL
 *   PAYLOAD_ADMIN_PASSWORD
 *   PAYLOAD_ADMIN_NAME (optional, defaults to "Admin")
 *
 * Idempotent: skips creation if a user with the same email already exists.
 * Run via: `pnpm --filter @depilmoni/cms seed:admin`
 */

import { getPayload } from "payload";

import config from "../payload.config";

const main = async () => {
  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;
  const name = process.env.PAYLOAD_ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.error(
      "[seed-admin] PAYLOAD_ADMIN_EMAIL e PAYLOAD_ADMIN_PASSWORD são obrigatórios."
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("[seed-admin] PAYLOAD_ADMIN_PASSWORD deve ter ao menos 8 caracteres.");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1
  });

  if (existing.docs.length > 0) {
    const current = existing.docs[0] as { id: string | number; role?: string };
    if (current.role !== "admin") {
      await payload.update({
        collection: "users",
        id: current.id,
        data: { role: "admin" }
      });
      console.log(`[seed-admin] Usuário ${email} promovido para admin.`);
    } else {
      console.log(`[seed-admin] Admin ${email} já existe — nada a fazer.`);
    }
    process.exit(0);
  }

  await payload.create({
    collection: "users",
    data: { email, password, name, role: "admin" }
  });

  console.log(`[seed-admin] Admin criado: ${email}`);
  process.exit(0);
};

main().catch((err) => {
  console.error("[seed-admin] Falha:", err);
  process.exit(1);
});
