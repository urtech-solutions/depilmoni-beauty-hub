import { NextResponse } from "next/server";
import { z } from "zod";

import { validateCoupon, type Coupon } from "@depilmoni/core";

import {
  getServerSession,
  payloadServerFetch,
  type PayloadListResponse
} from "@/lib/payload-server";

const BodySchema = z.object({
  code: z.string().min(1).transform((value) => value.trim().toUpperCase()),
  subtotal: z.number().nonnegative()
});

const mapCoupon = (doc: Record<string, unknown>): Coupon => ({
  id: String(doc.id),
  code: doc.code as string,
  discountType: doc.discountType as Coupon["discountType"],
  value: Number(doc.value ?? 0),
  minPurchase:
    typeof doc.minPurchase === "number" ? (doc.minPurchase as number) : undefined,
  active: Boolean(doc.active),
  startsAt: doc.startsAt as string,
  endsAt: doc.endsAt as string,
  combinableWithPromotions: Boolean(doc.combinableWithPromotions ?? true),
  combinableWithFidelity: Boolean(doc.combinableWithFidelity ?? true),
  maxUses: typeof doc.maxUses === "number" ? (doc.maxUses as number) : undefined,
  currentUses: Number(doc.currentUses ?? 0),
  eligibleProfiles: Array.isArray(doc.eligibleProfiles)
    ? (doc.eligibleProfiles as Coupon["eligibleProfiles"])
    : [],
  eligibleTags: Array.isArray(doc.eligibleTags)
    ? (doc.eligibleTags as { value: string }[]).map((tag) => tag.value)
    : []
});

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Código de cupom ou subtotal inválido" }, { status: 400 });
  }

  try {
    const encoded = encodeURIComponent(parsed.data.code);
    const result = await payloadServerFetch<PayloadListResponse<Record<string, unknown>>>(
      `/api/coupons?where[code][equals]=${encoded}&limit=1`,
      session.token
    );

    const coupon = result.docs[0] ? mapCoupon(result.docs[0]) : null;

    const validation = validateCoupon({
      coupon,
      customer: {
        profileType: session.user.profileType,
        tags: session.user.tags ?? []
      },
      subtotal: parsed.data.subtotal
    });

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, reason: validation.reason, message: validation.message },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount: validation.discount,
      code: validation.coupon.code,
      discountType: validation.coupon.discountType,
      value: validation.coupon.value
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao validar cupom" },
      { status: 400 }
    );
  }
}
