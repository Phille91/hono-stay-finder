import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export type BasicSupabAseClient = ReturnType<typeof createServerClient>;

declare module "hono" {
  interface ContectVariableMap {
    subabase: BasicSupabAseClient;
    user: User | null;
  }
}
