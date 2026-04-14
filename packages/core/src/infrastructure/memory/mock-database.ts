import type { MockDatabase } from "../../domain/models";
import { MockDatabaseSchema } from "../../domain/models";
import { createSeedData } from "../seeds/mock-seed";

const createState = () => MockDatabaseSchema.parse(createSeedData());

let state: MockDatabase = createState();

export const mockDatabase = {
  getState() {
    return state;
  },
  reset() {
    state = createState();
  }
};
