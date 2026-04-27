import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { payloadAdminFetch } from "@/lib/payload-admin";
import { type PayloadDoc, type PayloadListResponse } from "@/lib/payload-server";

const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET ?? "";

const verifySignature = (rawBody: string, signature: string | null): boolean => {
  if (!MP_WEBHOOK_SECRET) return true;
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, ...valueParts] = part.split("=");
      return [key?.trim(), valueParts.join("=").trim()];
    })
  );

  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:;request-id:;ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", MP_WEBHOOK_SECRET)
    .update(manifest + rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
};

const mpStatusToOrderStatus: Record<string, string> = {
  approved: "paid",
  in_process: "awaiting-payment",
  rejected: "cancelled",
  refunded: "refunded",
  cancelled: "cancelled"
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action ?? body.type;
  if (action !== "payment.updated" && action !== "payment") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const paymentData = (body.data as Record<string, unknown> | undefined) ?? {};
  const externalId = String(paymentData.id ?? "");
  const mpStatus = String(paymentData.status ?? body.status ?? "");

  if (!externalId || !mpStatus) {
    return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
  }

  const newOrderStatus = mpStatusToOrderStatus[mpStatus];
  if (!newOrderStatus) {
    return NextResponse.json({ ok: true, skipped: true, reason: `unknown MP status: ${mpStatus}` });
  }

  try {
    const result = await payloadAdminFetch<PayloadListResponse<PayloadDoc>>(
      `/api/orders?where[paymentExternalId][equals]=${encodeURIComponent(externalId)}&limit=1`
    );

    const order = result.docs[0];
    if (!order) {
      return NextResponse.json({ ok: true, skipped: true, reason: "order not found" });
    }

    if (order.status === newOrderStatus) {
      return NextResponse.json({ ok: true, skipped: true, reason: "already at status" });
    }

    await payloadAdminFetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newOrderStatus })
    });

    return NextResponse.json({ ok: true, orderId: order.id, newStatus: newOrderStatus });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
