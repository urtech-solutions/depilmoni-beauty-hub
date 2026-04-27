type DomainEvents = {
  "order.paid": { orderId: string; customerId: string; orderCode: string; total: number };
  "order.shipped": {
    orderId: string;
    customerId: string;
    orderCode: string;
    trackingCode?: string;
    trackingUrl?: string;
  };
  "order.delivered": { orderId: string; customerId: string; orderCode: string };
  "order.cancelled": { orderId: string; customerId: string; orderCode: string; reason?: string };
  "xp.level-up": { customerId: string; levelName: string };
  "distributor.approved": { customerId: string; requestId: string };
  "distributor.rejected": { customerId: string; requestId: string; reason?: string };
};

export type DomainEventName = keyof DomainEvents;
export type DomainEventPayload<E extends DomainEventName> = DomainEvents[E];

type Handler<E extends DomainEventName> = (payload: DomainEvents[E]) => void | Promise<void>;

const listeners = new Map<string, Set<Handler<never>>>();

export const eventBus = {
  on<E extends DomainEventName>(event: E, handler: Handler<E>) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(handler as Handler<never>);
    return () => {
      listeners.get(event)?.delete(handler as Handler<never>);
    };
  },

  async emit<E extends DomainEventName>(event: E, payload: DomainEvents[E]) {
    const handlers = listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    const results = [...handlers].map((handler) => {
      try {
        return (handler as Handler<E>)(payload);
      } catch (error) {
        console.error(`[event-bus] handler error for "${event}":`, error);
        return undefined;
      }
    });

    await Promise.allSettled(results.filter(Boolean) as Promise<void>[]);
  },

  clear() {
    listeners.clear();
  }
};
