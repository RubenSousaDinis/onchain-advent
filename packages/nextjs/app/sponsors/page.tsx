"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { Award, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Leaderboard } from "~~/components/Leaderboard";
import RewardsContractAbi from "~~/contracts/rewardsContractAbi.json";
import { ISponsor } from "~~/types/ISponsor";

const REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS;

export default function Page() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sponsors, setSponsors] = useState<ISponsor[]>([]);
  const { data: hash, writeContract, error } = useWriteContract();
  const { authenticated } = usePrivy();
  const { isLoading, isError, isSuccess } = useWaitForTransactionReceipt({
    confirmations: 5,
    hash: hash // Transaction hash we want to track
  });

  useEffect(() => {
    (async () => {
      const result = await fetch("/api/sponsors/", {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      const { data } = await result.json();
      console.log("sponsors", data);
      setSponsors(data);
    })();
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error("Unable to sponsor, check if you have enough funds");
    }
  }, [error]);

  useEffect(() => {
    if (hash && isSuccess) {
      toast.success(hash);

      const data = {
        transactionHash: hash
      };
      (async () => {
        try {
          const result = await fetch("/api/sponsors", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });

          console.debug("result", result);

          const body = await result.json();

          console.debug("body", body);

          if (result.ok && body.data) {
            toast.success("Well Done! You have successfully completed this challenge!");
            setSubmitted(true);
            setAmount("");
          } else {
            toast.error(body.error);
          }
        } catch (e) {
          toast.error("Something went wrong");
          console.error("error from submission", e);
        }
      })();
    } else if (hash && isError) {
      console.error("Transaction failed");
    }
  }, [hash, isSuccess, isError]);

  const handleSubmit = () => {
    if (Number(amount) < 0.01) {
      toast.error("We require a minimum of 0.01 ETH to become a sponsor");
      return;
    }

    console.debug("REWARDS_CONTRACT_ADDRESS", REWARDS_CONTRACT_ADDRESS);

    writeContract({
      address: REWARDS_CONTRACT_ADDRESS || "",
      abi: RewardsContractAbi,
      functionName: "sponsor",
      value: ethers.parseUnits(amount.toString(), "ether")
    });
  };

  if (submitted) {
    return (
      <>
        <div className="alert alert-success my-6">
          <label>Thank you for your sponsorship! You are helping web2 developers to enter the onchain world.</label>
        </div>
        <Leaderboard sponsors={sponsors} />
      </>
    );
  }

  // if (isLoading) {
  // return <span className="loading loading-bars loading-lg"></span>;
  // }

  return (
    <>
      <div className="card bg-blue-800 shadow-xl mb-6">
        <div className="card-body gap-1">
          <h2 className="card-title text-xl mb-4">Become a Onchain Advent Sponsor</h2>
          <p className="text-lg">
            Support the next generation of blockchain developers and gain visibility in the BUILD community. Your
            sponsorship helps us create more challenges, improve our platform, and nurture talent.
          </p>
          <p className="mb-4 text-sm">
            In case you want to showcase your sponsor we recommend that you sign in with the wallet you have connected
            to your Talent Passport. If you want to preserve your identity you can fund please user a wallet not linked
            with any social app.
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Recognition on Leaderboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Access to Top Talent</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Branded Challenges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-blue-800 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Sponsor Onchain Advent</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Sponsorship Amount (ETH)</span>
            </label>
            <input
              type="number"
              placeholder="1 ETH"
              className="input input-bordered w-full text-white"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mt-6">
            <button
              className="btn btn-primary w-full text-white"
              onClick={handleSubmit}
              disabled={!authenticated || isLoading}
            >
              {authenticated ? (isLoading ? "...transaction in progress..." : "Become a Sponsor") : "Login to Sponsor"}
            </button>
          </div>
          {!authenticated && (
            <p className="mb-4 text-sm">
              You may also transfer ETH on Base to {REWARDS_CONTRACT_ADDRESS} in order to sponsor
            </p>
          )}
        </div>
      </div>
      <h2 className="card-title text-xl mb-4">Sponsors</h2>
      <Leaderboard sponsors={sponsors} />
    </>
  );
}
