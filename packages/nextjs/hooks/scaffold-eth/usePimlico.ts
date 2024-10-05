"use client";

import { createSmartAccountClient, SmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { useCallback, useEffect, useState } from "react";
import { http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { baseSepolia } from "viem/chains";
// Replace this with the chain used by your application
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const pimlicoRpcUrl = "https://api.pimlico.io/v2/84532/rpc?apikey=pim_EyuumaYUqFuZEADmW2thve";

const pimlicoClient = createPimlicoClient({
  transport: http(pimlicoRpcUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7"
  }
});

export default function usePimlico() {
  const { isConnected } = useAccount();
  const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const fetchPimlicoSmartAccount = useCallback(async () => {
    if (!publicClient || !walletClient) return;

    const simpleSmartAccount = await toSimpleSmartAccount({
      client: publicClient,
      owner: walletClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7"
      } // global entrypoint
    });

    const smartAccountClient = createSmartAccountClient({
      account: simpleSmartAccount,
      chain: baseSepolia,
      bundlerTransport: http(pimlicoRpcUrl, {}),
      paymaster: pimlicoClient,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast;
        }
      }
    });
    setSmartAccountClient(smartAccountClient);
    return smartAccountClient;
  }, [publicClient, walletClient]);

  const predictSmartAccountAddress = async () => {
    if (!publicClient || !walletClient) return;

    const simpleSmartAccount = await toSimpleSmartAccount({
      client: publicClient,
      owner: walletClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7"
      } // global entrypoint
    });
    return simpleSmartAccount.address;
  };

  useEffect(() => {
    if (isConnected && walletClient && publicClient) {
      fetchPimlicoSmartAccount();
    }
  }, [isConnected, walletClient, publicClient, fetchPimlicoSmartAccount]);

  return { smartAccountClient, predictSmartAccountAddress };
}
