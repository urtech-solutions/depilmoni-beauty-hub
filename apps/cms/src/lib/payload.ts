import config from "../payload.config";

import { getPayload } from "payload";

let payloadPromise: ReturnType<typeof getPayload> | null = null;

export const getPayloadInstance = () => {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config });
  }

  return payloadPromise;
};
