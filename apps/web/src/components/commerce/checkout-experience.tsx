"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

import type { Address, CheckoutResult } from "@depilmoni/core";
import { Badge, Button, Card, Input } from "@depilmoni/ui";

import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { cartSubtotal, useCartStore } from "@/store/cart-store";

type CouponValidationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; discount: number; code: string }
  | { status: "invalid"; message: string };

type ShippingOption = {
  id: string;
  label: string;
  amount: number;
  eta: string;
  carrier?: string;
};

export const CheckoutExperience = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const subtotal = cartSubtotal(items);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [shippingPostalCode, setShippingPostalCode] = useState("01310-100");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>();
  const [couponCode, setCouponCode] = useState("BEMVINDA10");
  const [couponValidation, setCouponValidation] = useState<CouponValidationState>({ status: "idle" });
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "pix">("credit-card");
  const [attendeeName, setAttendeeName] = useState("Maria Silva");
  const [customerName, setCustomerName] = useState(user?.name ?? "Maria Silva");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "maria@depilmoni.test");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
      setAttendeeName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(undefined);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/customer/addresses", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { addresses?: Address[] };
        if (cancelled || !data.addresses) return;
        setAddresses(data.addresses);
        const defaultAddress = data.addresses.find((address) => address.isDefault) ?? data.addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setShippingPostalCode(defaultAddress.zipCode);
        }
      } catch {
        /* ignore */
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const selectedShipping = useMemo(
    () => shippingOptions.find((option) => option.id === selectedShippingId),
    [shippingOptions, selectedShippingId]
  );

  const orderItems = useMemo(
    () =>
      items.map((item) =>
        item.type === "product"
          ? {
              type: "product" as const,
              productId: item.meta.productId,
              variantId: item.meta.variantId,
              quantity: item.quantity
            }
          : {
              type: "event-ticket" as const,
              eventId: item.meta.eventId,
              batchId: item.meta.batchId,
              quantity: item.quantity
            }
      ),
    [items]
  );

  const fetchShipping = async () => {
    setLoadingShipping(true);
    setError(null);

    try {
      const response = await fetch("/api/mock/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: shippingPostalCode,
          items: orderItems
        })
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel calcular o frete.");
      }

      const data = (await response.json()) as { options: ShippingOption[] };
      setShippingOptions(data.options);
      setSelectedShippingId(data.options[0]?.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erro inesperado no frete.");
    } finally {
      setLoadingShipping(false);
    }
  };

  const validateCouponNow = async () => {
    if (!user || !couponCode.trim()) {
      setCouponValidation({ status: "idle" });
      return;
    }

    setCouponValidation({ status: "loading" });
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal })
      });
      const data = (await response.json()) as
        | { valid: true; discount: number; code: string }
        | { valid: false; message: string };

      if ("valid" in data && data.valid) {
        setCouponValidation({ status: "valid", discount: data.discount, code: data.code });
      } else {
        setCouponValidation({
          status: "invalid",
          message: "message" in data ? data.message : "Cupom inválido"
        });
      }
    } catch {
      setCouponValidation({ status: "invalid", message: "Falha ao validar cupom" });
    }
  };

  const submitCheckout = async () => {
    setLoadingCheckout(true);
    setError(null);

    if (!user) {
      setError("Faça login para concluir o pedido.");
      setLoadingCheckout(false);
      router.push("/login?next=/checkout");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          addressId: selectedAddressId,
          couponCode: couponCode || undefined,
          shippingAmount: selectedShipping?.amount ?? 0,
          shippingMethodId: selectedShipping?.id,
          paymentMethod,
          attendeeName
        })
      });

      const data = (await response.json()) as {
        error?: string;
        order?: {
          id: string;
          code: string;
          total: number;
          xpEarned: number;
          leveledUp: boolean;
          level: string | null;
        };
      };

      if (!response.ok || !data.order) {
        throw new Error(data.error ?? "Falha ao concluir checkout.");
      }

      clear();
      const qs = new URLSearchParams({
        code: data.order.code,
        orderId: data.order.id,
        total: String(data.order.total),
        xp: String(data.order.xpEarned),
        ...(data.order.level ? { level: data.order.level } : {})
      });
      router.push(`/checkout/sucesso?${qs.toString()}`);
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : "Erro inesperado no checkout.";
      setError(reason);
      router.push(`/checkout/falha?reason=${encodeURIComponent(reason)}`);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (items.length === 0 && !result) {
    return (
      <Card className="p-8 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
          Checkout aguardando itens
        </p>
        <h2 className="mt-3 font-display text-4xl">Adicione produtos ou tickets primeiro.</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          O fluxo mockado recalcula preco, frete, XP e estoque a partir do carrinho.
        </p>
      </Card>
    );
  }

  if (result) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <Card className="space-y-6 p-8">
          <div>
            <Badge variant="accent">Pedido concluido</Badge>
            <h2 className="mt-3 font-display text-4xl">
              {customerName}, seu pedido {result.order.code} foi confirmado.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              O mock validou cupom, calculou frete, simulou pagamento, decrementou estoque e gerou tickets quando aplicavel.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Total pago</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {formatCurrency(result.order.total)}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">XP gerado</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{result.order.xpEarned}</p>
            </Card>
          </div>

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Parcelamento simulado
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {result.installments.slice(0, 4).map((option) => (
                <div
                  key={option.label}
                  className="rounded-2xl border border-border/70 bg-background/70 p-3 text-sm"
                >
                  {option.label}
                </div>
              ))}
            </div>
          </Card>
        </Card>

        <div className="space-y-4">
          {result.tickets.map((ticket) => (
            <Card key={ticket.id} className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                Ticket confirmado
              </p>
              <h3 className="mt-2 font-display text-3xl">{ticket.eventTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Status de check-in: {ticket.status}</p>
              <div className="relative mt-5 aspect-square max-w-[220px] overflow-hidden rounded-[20px] border border-border/70">
                <Image src={ticket.qrCode} alt={`QR Code ${ticket.eventTitle}`} fill unoptimized />
              </div>
            </Card>
          ))}

          {result.tickets.length === 0 ? (
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">
                Nenhum ticket foi emitido neste pedido. O fluxo foi de produto fisico.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
              Dados do pedido
            </p>
            <h2 className="mt-3 font-display text-4xl">Checkout mockado ponta a ponta</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={customerName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value)}
              placeholder="Nome completo"
            />
            <Input
              value={customerEmail}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCustomerEmail(event.target.value)}
              placeholder="E-mail"
            />
            <Input placeholder="CPF" defaultValue="123.456.789-00" />
            <Input placeholder="Telefone" defaultValue="(11) 98888-0000" />
            <Input
              value={shippingPostalCode}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setShippingPostalCode(event.target.value)}
              placeholder="CEP"
            />
            <Input placeholder="Cidade" defaultValue="Sao Paulo" />
            <Input className="md:col-span-2" placeholder="Endereco" defaultValue="Av. Paulista, 1000" />
          </div>
        </Card>

        {user && addresses.length > 0 ? (
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                Endereços salvos
              </p>
              <h2 className="mt-2 font-display text-2xl">Selecione a entrega</h2>
            </div>
            <div className="space-y-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => {
                    setSelectedAddressId(address.id);
                    setShippingPostalCode(address.zipCode);
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    selectedAddressId === address.id
                      ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]"
                      : "border-border/70 bg-background/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{address.label}</p>
                    {address.isDefault ? (
                      <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-copper)]">
                        padrão
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.street}, {address.number}
                    {address.complement ? ` — ${address.complement}` : ""} • {address.neighborhood},{" "}
                    {address.city}/{address.state} — {address.zipCode}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        ) : null}

        <Card className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Calcular frete</p>
              <Input
                value={shippingPostalCode}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setShippingPostalCode(event.target.value)}
                placeholder="CEP"
                className="mt-3"
              />
            </div>
            <Button variant="outline" onClick={fetchShipping} disabled={loadingShipping}>
              {loadingShipping ? "Calculando..." : "Calcular frete"}
            </Button>
          </div>

          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedShippingId(option.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedShippingId === option.id
                    ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]"
                    : "border-border/70 bg-background/70"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {option.carrier ? `${option.carrier} • ${option.eta}` : option.eta}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(option.amount)}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input
                value={couponCode}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setCouponCode(event.target.value.toUpperCase());
                  setCouponValidation({ status: "idle" });
                }}
                onBlur={validateCouponNow}
                placeholder="Cupom"
              />
              {couponValidation.status === "loading" ? (
                <p className="mt-2 text-xs text-muted-foreground">Validando cupom…</p>
              ) : null}
              {couponValidation.status === "valid" ? (
                <p className="mt-2 text-xs text-[var(--color-accent-copper)]">
                  {couponValidation.code} aplicado — desconto de {formatCurrency(couponValidation.discount)}
                </p>
              ) : null}
              {couponValidation.status === "invalid" ? (
                <p className="mt-2 text-xs text-red-600">{couponValidation.message}</p>
              ) : null}
            </div>
            <Input
              value={attendeeName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setAttendeeName(event.target.value)}
              placeholder="Nome do participante do evento"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={() => setPaymentMethod("credit-card")}
              className={`rounded-2xl border p-4 text-left ${paymentMethod === "credit-card" ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]" : "border-border/70"}`}
            >
              <p className="font-medium">Cartao de credito</p>
              <p className="text-sm text-muted-foreground">Parcelamento mockado via Mercado Pago</p>
            </button>
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`rounded-2xl border p-4 text-left ${paymentMethod === "pix" ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]" : "border-border/70"}`}
            >
              <p className="font-medium">Pix</p>
              <p className="text-sm text-muted-foreground">Confirmacao imediata mockada</p>
            </button>
          </div>
        </Card>
      </div>

      <Card className="h-fit space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-copper)]">
            Resumo do checkout
          </p>
          <h2 className="mt-3 font-display text-3xl">Itens do pedido</h2>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-muted-foreground">Qtd. {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 rounded-3xl bg-[rgba(201,157,84,0.1)] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal parcial</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span>{selectedShipping ? formatCurrency(selectedShipping.amount) : "Selecione"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cupom informado</span>
            <span>{couponCode || "Nenhum"}</span>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={submitCheckout}
          disabled={loadingCheckout || !selectedShipping}
        >
          {loadingCheckout ? "Processando..." : "Confirmar pedido"}
        </Button>
      </Card>
    </div>
  );
};
