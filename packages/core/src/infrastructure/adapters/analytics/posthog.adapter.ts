export const posthogAdapter = {
  capture(event: string, properties?: Record<string, unknown>) {
    return { event, properties, provider: "posthog", mocked: true };
  }
};
