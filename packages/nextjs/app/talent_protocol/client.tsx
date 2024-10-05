import { TALENT_PROTOCOL_API_KEY } from "~~/constants";

export const getWalletPassport = async (wallet: string) => {
  const result = await fetch(`https://api.talentprotocol.com/api/v2/passports/${wallet}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-API-KEY": TALENT_PROTOCOL_API_KEY
    }
  });

  return await result.json();
};
