import { OrderItemSchema, getShippingOptions } from "@depilmoni/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      postalCode?: string;
      items: unknown[];
    };

    const items = OrderItemSchema.array().parse(body.items);
    const options = await getShippingOptions(items, body.postalCode);

    return NextResponse.json({ options });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro inesperado ao calcular frete."
      },
      { status: 400 }
    );
  }
}
