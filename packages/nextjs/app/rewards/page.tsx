/* eslint-disable */
// @ts-nocheck
"use client";

import { wagmiConfig } from "../shared/wagmiConfig";
import { usePrivy } from "@privy-io/react-auth";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { encodeFunctionData } from "viem";
import rewardsContractAbi from "~~/contracts/rewardsContractAbi.json";
import usePimlico from "~~/hooks/scaffold-eth/usePimlico";

const REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS;

export default function Page() {
  const { user } = usePrivy();
  const { predictSmartAccountAddress, smartAccountClient } = usePimlico();
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>();
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [pendingRewards, setPendingRewards] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);

  const mainWallet = user?.wallet?.address;

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

  useEffect(() => {
    if (smartWalletAddress) {
      (async () => {
        const whitelisted = (await readContract(wagmiConfig, {
          abi: rewardsContractAbi,
          address: REWARDS_CONTRACT_ADDRESS,
          functionName: "whitelistedRewardsAddresses",
          args: [1, smartWalletAddress]
        })) as boolean;

        const claimed = (await readContract(wagmiConfig, {
          abi: rewardsContractAbi,
          address: REWARDS_CONTRACT_ADDRESS,
          functionName: "claimedRewards",
          args: [smartWalletAddress, 1]
        })) as number;

        setPendingRewards(whitelisted && claimed == 0);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartWalletAddress]);

  const claim = async () => {
    setClaiming(true);
    if (!smartAccountClient) {
      throw "Smart accoubt client needed";
    }
    if (!mainWallet) {
      throw "mainWallet needed";
    }

    setClaiming(true);
    const txHash = await smartAccountClient.sendTransaction({
      to: REWARDS_CONTRACT_ADDRESS,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: rewardsContractAbi,
        functionName: "claimReward",
        args: [1]
      }),
      account: smartAccountClient.account
    });

    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: txHash, confirmations: 2 });

    console.log(receipt, "receipt");

    toast.success(`Well Done! Your rewards were claimed!`);
    setClaiming(false);
  };

  return (
    <>
      <div className="card bg-blue-800 shadow-xl mb-6">
        <div className="card-body gap-1">
          <h2 className="card-title text-xl mb-4">Claim your rewards</h2>
          <p className="text-lg">
            You will not need to spend any amount to claim your rewards. We will sponsor the gas fee of your transaction
            using account abstraction.
          </p>
          {smartWalletAddress && <p className="text-lg">Your smart wallet address: {smartWalletAddress}</p>}
        </div>
      </div>

      {pendingRewards ? (
        <div className="bg-blue-700 text-white p-4 font-sans">
          <p className="text-lg">You have pending rewards</p>
          <button onClick={claim} className="btn btn-primary">
            {claiming ? <span className="loading loading-spinner"></span> : "Claim"}
          </button>
        </div>
      ) : (
        <div className="bg-blue-700 text-white p-4 font-sans">
          <p className="text-lg">
            You have no rewards to claim. Wait for the next day to claim if you completed today exercise and you are
            amongst the fastest 100
          </p>
        </div>
      )}
    </>
  );
}
