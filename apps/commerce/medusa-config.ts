import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl:
      process.env.MEDUSA_DATABASE_URL ??
      "postgresql://depilmoni:depilmoni@localhost:5432/depilmoni_medusa",
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    http: {
      storeCors: process.env.STORE_CORS ?? "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS ?? "http://localhost:3001",
      authCors: process.env.AUTH_CORS ?? "http://localhost:3000,http://localhost:3001"
    }
  }
});
