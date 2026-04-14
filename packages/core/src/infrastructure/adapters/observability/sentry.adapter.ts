export const sentryAdapter = {
  init(dsn?: string) {
    return { provider: "sentry", enabled: Boolean(dsn) };
  },
  captureMessage(message: string, context?: Record<string, unknown>) {
    return { message, context, mocked: true };
  }
};
