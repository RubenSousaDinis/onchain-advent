import { PrivyClient } from "@privy-io/server-auth";

if (!process.env.NEXT_PRIVY_APP_ID || !process.env.NEXT_PRIVY_SECRET)
  throw new Error("NEXT_PRIVY_APP_ID or NEXT_PRIVY_SECRET is not set");

const globalForPrivy = global as unknown as { privyClient: PrivyClient };

export const privyClient =
  globalForPrivy.privyClient || new PrivyClient(process.env.NEXT_PRIVY_APP_ID, process.env.NEXT_PRIVY_SECRET);

export default privyClient;
