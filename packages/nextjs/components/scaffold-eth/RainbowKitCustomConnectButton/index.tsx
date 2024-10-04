"use client";

// @refresh reset
import { useEffect } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { usePrivy } from "@privy-io/react-auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { ready, authenticated, login, user } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const walletAddress = user?.wallet?.address;

  useEffect(() => {
    if (user && walletAddress) {
      const params = {
        privy_id: user.id,
        wallet: walletAddress,
      };

      (async () => {
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(params),
        });
      })();
    }
  }, [user, walletAddress]);

  return (
    <ConnectButton.Custom>
      {({ account }) => {
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

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
                    <div className="flex flex-col items-center mr-1">
                      <Balance address={walletAddress as Address} className="min-h-0 h-auto" />
                      <span className="text-xs" style={{ color: networkColor }}>
                        {walletAddress}
                      </span>
                    </div>
                    <AddressInfoDropdown
                      address={walletAddress as Address}
                      displayName={"wallet"}
                      blockExplorerAddressLink={blockExplorerAddressLink}
                    />
                    <AddressQRCodeModal address={walletAddress as Address} modalId="qrcode-modal" />
                  </>
                );
              }
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
