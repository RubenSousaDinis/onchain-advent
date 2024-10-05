"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { Address } from "viem";
import usePimlico from "~~/hooks/scaffold-eth/usePimlico";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const LoginButton = () => {
  const { ready, authenticated, login, user } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const { predictSmartAccountAddress } = usePimlico();

  const walletAddress = user?.wallet?.address;

  useEffect(() => {
    if (user?.id) {
      (async () => {
        const smartWallet = await predictSmartAccountAddress();

        if (!smartWallet) {
          return;
        }

        const params = {
          privy_id: user.id,
          smartWalletAddress: smartWallet
        };

        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(params)
        });
      })();
    }
  }, [user?.id, predictSmartAccountAddress]);

  return (
    <>
      {(() => {
        if (!disableLogin) {
          return (
            <button className="btn btn-primary btn-sm" onClick={login} type="button">
              Login
            </button>
          );
        }

        if (walletAddress) {
          return (
            <>
              <AddressInfoDropdown address={walletAddress as Address} displayName={"wallet"} />
              <AddressQRCodeModal address={walletAddress as Address} modalId="qrcode-modal" />
            </>
          );
        }
      })()}
    </>
  );
};
