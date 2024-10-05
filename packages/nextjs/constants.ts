import { getEnvVariable } from "./utils/env";

export const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
export const DEPLOYED_CONTRACTS_JSON_RPC_URL = getEnvVariable("NEXT_PUBLIC_DEPLOYED_CONTRACTS_JSON_RPC_URL");
export const PRIVY_APP_ID = getEnvVariable("NEXT_PRIVY_APP_ID");
export const PRIVY_SECRET = getEnvVariable("NEXT_PRIVY_SECRET");
export const SUPABASE_URL = getEnvVariable("NEXT_SUPABASE_URL");
export const SUPABASE_ANON_KEY = getEnvVariable("NEXT_SUPABASE_ANON_KEY");
export const ENV = getEnvVariable("ENV", "development");
export const REWARDS_CONTRACT_ADDRESS = getEnvVariable("NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS");
export const TALENT_PROTOCOL_API_KEY = getEnvVariable("TALENT_PROTOCOL_API_KEY");
