import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Addresses } from "./collections/Addresses";
import { Banners } from "./collections/Banners";
import { BlogPosts } from "./collections/BlogPosts";
import { Coupons } from "./collections/Coupons";
import { Customers } from "./collections/Customers";
import { DistributorRequests } from "./collections/DistributorRequests";
import { Events } from "./collections/Events";
import { FidelityTags } from "./collections/FidelityTags";
import { InventoryMovements } from "./collections/InventoryMovements";
import { LandingPages } from "./collections/LandingPages";
import { Media } from "./collections/Media";
import { Notifications } from "./collections/Notifications";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";
import { Promotions } from "./collections/Promotions";
import { Users } from "./collections/Users";
import { XPLevels } from "./collections/XPLevels";
import { XPTransactions } from "./collections/XPTransactions";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "depilmoni-payload-secret",
  editor: lexicalEditor(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname
    },
    components: {
      afterDashboard: ["./components/dashboard/manager-dashboard#ManagerDashboard"]
    }
  },
  collections: [
    Users,
    Customers,
    Media,
    Banners,
    LandingPages,
    Products,
    Events,
    Promotions,
    Coupons,
    BlogPosts,
    XPLevels,
    FidelityTags,
    Addresses,
    Orders,
    DistributorRequests,
    XPTransactions,
    Notifications,
    InventoryMovements
  ],
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.PAYLOAD_DATABASE_URL ??
        "postgresql://depilmoni:depilmoni@localhost:5432/depilmoni_payload"
    }
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts")
  }
});
