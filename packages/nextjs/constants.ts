import { getEnvVariable } from "./utils/env";

export const DEPLOYED_CONTRACTS_JSON_RPC_URL = getEnvVariable(
  "DEPLOYED_CONTRACTS_JSON_RPC_URL",
  "https://base-sepolia-rpc.publicnode.com"
);
export const PRIVY_APP_ID = getEnvVariable("NEXT_PRIVY_APP_ID");
export const PRIVY_SECRET = getEnvVariable("NEXT_PRIVY_SECRET");
export const SUPABASE_URL = getEnvVariable("NEXT_SUPABASE_URL");
export const SUPABASE_ANON_KEY = getEnvVariable("NEXT_SUPABASE_ANON_KEY");
