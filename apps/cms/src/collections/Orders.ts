import type { CollectionConfig } from "payload";

import { eventBus } from "@depilmoni/core";

import { canManageCommerce } from "../access";

const fulfillmentStatusMessages: Record<string, { title: string; messageFn: (code: string) => string }> = {
  shipped: {
    title: "Pedido enviado",
    messageFn: (code) => `Seu pedido ${code} foi enviado. Acompanhe o rastreio na central.`
  },
  delivered: {
    title: "Pedido entregue",
    messageFn: (code) => `Seu pedido ${code} foi entregue. Esperamos que goste!`
  },
  cancelled: {
    title: "Pedido cancelado",
    messageFn: (code) => `Seu pedido ${code} foi cancelado.`
  }
};

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "code"
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        if (operation !== "update") return doc;
        const newStatus = doc.status as string;
        const oldStatus = previousDoc?.status as string | undefined;
        if (!oldStatus || newStatus === oldStatus) return doc;

        const customerId = typeof doc.customer === "object" ? String(doc.customer.id) : String(doc.customer);
        const orderId = String(doc.id);
        const orderCode = String(doc.code);

        const statusMsg = fulfillmentStatusMessages[newStatus];
        if (statusMsg) {
          try {
            await req.payload.create({
              collection: "notifications",
              data: {
                customer: doc.customer,
                type: "order-status",
                title: statusMsg.title,
                message: statusMsg.messageFn(orderCode),
                href: `/minha-conta/pedidos/${orderId}`,
                read: false
              }
            });
          } catch (error) {
            console.error("[orders hook] failed to create notification:", error);
          }
        }

        if (newStatus === "shipped") {
          await eventBus.emit("order.shipped", {
            orderId,
            customerId,
            orderCode,
            trackingCode: doc.trackingCode as string | undefined,
            trackingUrl: doc.trackingUrl as string | undefined
          });
        } else if (newStatus === "delivered") {
          await eventBus.emit("order.delivered", { orderId, customerId, orderCode });
        } else if (newStatus === "cancelled") {
          await eventBus.emit("order.cancelled", { orderId, customerId, orderCode });
        }

        return doc;
      }
    ]
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: ({ req }) => Boolean(req.user),
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      index: true
    },
    { name: "code", type: "text", required: true, unique: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pendente", value: "pending" },
        { label: "Aguardando pagamento", value: "awaiting-payment" },
        { label: "Pago", value: "paid" },
        { label: "Processando", value: "processing" },
        { label: "Enviado", value: "shipped" },
        { label: "Entregue", value: "delivered" },
        { label: "Cancelado", value: "cancelled" },
        { label: "Reembolsado", value: "refunded" }
      ]
    },
    { name: "items", type: "json", required: true },
    { name: "subtotal", type: "number", required: true },
    { name: "profileDiscount", type: "number", defaultValue: 0 },
    { name: "fidelityDiscount", type: "number", defaultValue: 0 },
    { name: "promotionDiscount", type: "number", defaultValue: 0 },
    { name: "couponDiscount", type: "number", defaultValue: 0 },
    { name: "couponCode", type: "text" },
    { name: "shippingAmount", type: "number", defaultValue: 0 },
    {
      name: "shippingAddress",
      type: "relationship",
      relationTo: "addresses"
    },
    { name: "total", type: "number", required: true },
    {
      name: "paymentMethod",
      type: "select",
      options: [
        { label: "Cartao de credito", value: "credit-card" },
        { label: "PIX", value: "pix" }
      ]
    },
    { name: "paymentExternalId", type: "text" },
    { name: "xpEarned", type: "number", defaultValue: 0 },
    { name: "trackingCode", type: "text" },
    { name: "trackingUrl", type: "text" },
    { name: "shippedAt", type: "date" },
    { name: "deliveredAt", type: "date" }
  ]
};
