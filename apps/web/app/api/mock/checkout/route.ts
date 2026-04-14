import { OrderItemSchema, runMockCheckout } from "@depilmoni/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerId: string;
      items: unknown[];
      couponCode?: string;
      shippingMethodId?: string;
      shippingPostalCode?: string;
      paymentMethod: "credit-card" | "pix";
      attendeeName?: string;
    };

    const result = await runMockCheckout({
      customerId: body.customerId,
      items: OrderItemSchema.array().parse(body.items),
      couponCode: body.couponCode,
      shippingMethodId: body.shippingMethodId,
      shippingPostalCode: body.shippingPostalCode,
      paymentMethod: body.paymentMethod,
      attendeeName: body.attendeeName
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro inesperado no checkout."
      },
      { status: 400 }
    );
  }
}
