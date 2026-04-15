import type {
  Address,
  DistributorRequest,
  Notification,
  Order,
  XPLevel,
  XPTransaction
} from "@depilmoni/core";

import type { PayloadDoc } from "./payload-server";
import { toPayloadId } from "./payload-server";

export const mapAddress = (doc: PayloadDoc): Address => ({
  id: String(doc.id),
  customerId: toPayloadId(doc.customer as string | number | PayloadDoc | null | undefined),
  label: (doc.label as string) ?? "Principal",
  recipientName: doc.recipientName as string,
  street: doc.street as string,
  number: doc.number as string,
  complement: (doc.complement as string) ?? undefined,
  neighborhood: doc.neighborhood as string,
  city: doc.city as string,
  state: doc.state as string,
  zipCode: doc.zipCode as string,
  isDefault: Boolean(doc.isDefault),
  latitude: typeof doc.latitude === "number" ? doc.latitude : undefined,
  longitude: typeof doc.longitude === "number" ? doc.longitude : undefined,
  createdAt: (doc.createdAt as string) ?? undefined
});

export const mapOrder = (doc: PayloadDoc): Order => ({
  id: String(doc.id),
  customerId: toPayloadId(doc.customer as string | number | PayloadDoc | null | undefined),
  code: doc.code as string,
  status: doc.status as Order["status"],
  items: (doc.items as Order["items"]) ?? [],
  subtotal: Number(doc.subtotal ?? 0),
  profileDiscount: Number(doc.profileDiscount ?? 0),
  fidelityDiscount: Number(doc.fidelityDiscount ?? 0),
  promotionDiscount: Number(doc.promotionDiscount ?? 0),
  couponDiscount: Number(doc.couponDiscount ?? 0),
  couponCode: (doc.couponCode as string) ?? undefined,
  shippingAmount: Number(doc.shippingAmount ?? 0),
  shippingAddressId:
    toPayloadId(doc.shippingAddress as string | number | PayloadDoc | null | undefined) ||
    undefined,
  total: Number(doc.total ?? 0),
  paymentMethod: (doc.paymentMethod as Order["paymentMethod"]) ?? undefined,
  paymentExternalId: (doc.paymentExternalId as string) ?? undefined,
  xpEarned: Number(doc.xpEarned ?? 0),
  trackingCode: (doc.trackingCode as string) ?? undefined,
  trackingUrl: (doc.trackingUrl as string) ?? undefined,
  shippedAt: (doc.shippedAt as string) ?? undefined,
  deliveredAt: (doc.deliveredAt as string) ?? undefined,
  createdAt: doc.createdAt as string,
  updatedAt: (doc.updatedAt as string) ?? undefined
});

export const mapNotification = (doc: PayloadDoc): Notification => ({
  id: String(doc.id),
  customerId: toPayloadId(doc.customer as string | number | PayloadDoc | null | undefined),
  type: doc.type as Notification["type"],
  title: doc.title as string,
  message: doc.message as string,
  href: (doc.href as string) ?? undefined,
  read: Boolean(doc.read),
  createdAt: doc.createdAt as string
});

export const mapXPTransaction = (doc: PayloadDoc): XPTransaction => ({
  id: String(doc.id),
  customerId: toPayloadId(doc.customer as string | number | PayloadDoc | null | undefined),
  amount: Number(doc.amount ?? 0),
  source: doc.source as XPTransaction["source"],
  referenceId: (doc.referenceId as string) ?? "",
  createdAt: doc.createdAt as string
});

export const mapXPLevel = (doc: PayloadDoc): XPLevel => ({
  id: String(doc.id),
  level: Number(doc.level ?? 0),
  name: doc.name as string,
  minXP: Number(doc.minXP ?? 0),
  benefits: Array.isArray(doc.benefits)
    ? (doc.benefits as { label?: string }[]).map((benefit) => benefit.label ?? "")
    : []
});

export const mapDistributorRequest = (doc: PayloadDoc): DistributorRequest => ({
  id: String(doc.id),
  customerId: toPayloadId(doc.customer as string | number | PayloadDoc | null | undefined),
  responsibleName: doc.responsibleName as string,
  companyName: doc.companyName as string,
  tradeName: doc.tradeName as string,
  cnpj: doc.cnpj as string,
  stateRegistration: (doc.stateRegistration as string) ?? undefined,
  phone: doc.phone as string,
  commercialAddress: {
    street: ((doc.commercialAddress as PayloadDoc)?.street as string) ?? "",
    number: ((doc.commercialAddress as PayloadDoc)?.number as string) ?? undefined,
    neighborhood: ((doc.commercialAddress as PayloadDoc)?.neighborhood as string) ?? undefined,
    city: ((doc.commercialAddress as PayloadDoc)?.city as string) ?? "",
    state: ((doc.commercialAddress as PayloadDoc)?.state as string) ?? "",
    zipCode: ((doc.commercialAddress as PayloadDoc)?.zipCode as string) ?? ""
  },
  website: (doc.website as string) ?? undefined,
  socialMedia: (doc.socialMedia as string) ?? undefined,
  observations: (doc.observations as string) ?? undefined,
  documents: Array.isArray(doc.documents)
    ? (doc.documents as { file?: string | PayloadDoc }[]).flatMap((item) =>
        item.file
          ? [toPayloadId(item.file as string | number | PayloadDoc | null | undefined)]
          : []
      )
    : [],
  termsAccepted: Boolean(doc.termsAccepted),
  status: doc.status as DistributorRequest["status"],
  reviewedBy: doc.reviewedBy
    ? toPayloadId(doc.reviewedBy as string | number | PayloadDoc | null | undefined)
    : null,
  reviewedAt: doc.reviewedAt ? String(doc.reviewedAt) : null,
  reviewNotes: (doc.reviewNotes as string) ?? undefined,
  createdAt: doc.createdAt as string
});
