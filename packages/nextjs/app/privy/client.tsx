import { PrivyClient } from "@privy-io/server-auth";
import { PRIVY_APP_ID, PRIVY_SECRET } from "~~/constants";

if (!PRIVY_APP_ID || !PRIVY_SECRET) throw new Error("NEXT_PRIVY_APP_ID or NEXT_PRIVY_SECRET is not set");

const globalForPrivy = global as unknown as { privyClient: PrivyClient };

export const privyClient = globalForPrivy.privyClient || new PrivyClient(PRIVY_APP_ID, PRIVY_SECRET);

export default privyClient;
