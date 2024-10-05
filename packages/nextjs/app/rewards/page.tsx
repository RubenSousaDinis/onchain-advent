"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import usePimlico from "~~/hooks/scaffold-eth/usePimlico";

export default function Page() {
  const { user } = usePrivy();
  const { predictSmartAccountAddress } = usePimlico();
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>();
  const [loadingUser, setLoadingUser] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id && !loadingUser) {
      setLoadingUser(true);
      (async () => {
        const smartWallet = await predictSmartAccountAddress();
        setSmartWalletAddress(smartWallet);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loadingUser]);

  return (
    <>
      <div className="card bg-blue-800 shadow-xl mb-6">
        <div className="card-body gap-1">
          <h2 className="card-title text-xl mb-4">Claim your rewards</h2>
          <p className="text-lg">
            You will not need to spend any amount to claim your rewards. We will sponsor the gas fee of your transaction
            using account abstraction.
          </p>
          <p className="text-lg">Your smart wallet address: ${smartWalletAddress}</p>
          {smartWalletAddress}
        </div>
      </div>

      <div className="bg-blue-700 text-white p-4 font-sans">
        <div className="space-y-4"></div>
      </div>
    </>
  );
}
