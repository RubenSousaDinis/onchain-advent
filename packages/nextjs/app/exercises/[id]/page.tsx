"use client";

import { usePrivy } from "@privy-io/react-auth";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { type IExercise } from "~~/types/IExercise";

export default function Exercise({ params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;
  const [exercise, setExercise] = useState<IExercise>();
  const [transactionHash, setTransactionHash] = useState("");
  const { authenticated, user } = usePrivy();

  const endDate = exercise?.date ? new Date(exercise.date) : null;
  endDate?.setUTCHours(23, 59, 59, 999);

  const onSubmit = () => {
    if (!exercise || !user) {
      return;
    }

    const data = {
      transactionHash
    };

    (async () => {
      try {
        const result = await fetch(`/api/exercises/${exerciseId}/submissions`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-privy-user-id": user.id
          }
        });

        console.debug("result", result);

        const body = await result.json();

        console.debug("body", body);

        if (result.ok && body.submission) {
          toast.success("Well Done! You have successfully completed this challenge!");
        } else {
          toast.error(body.error);
        }
      } catch (e) {
        toast.error("Something went wrong");
        console.error("error from submission", e);
      }
    })();
  };

  const onTransactionHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionHash(event.target.value);
  };

  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/exercises/${exerciseId}`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      const { exercise } = await result.json();
      setExercise(exercise);
    })();
  }, [exerciseId]);

  if (!exercise) {
    return <span className="loading loading-bars loading-lg"></span>;
  } else {
    return (
      <>
        <div className="card bg-blue-800 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">
              {new Date(exercise.date).toLocaleDateString("en-us", { day: "numeric", month: "long" })}
            </h2>
            <p className="mb-4">{exercise.description}</p>
            <div className="mockup-code mb-4">
              <pre>
                <code>
                  {`contract Inefficient {
                    uint256[] public numbers;
                    
                    function addNumber(uint256 _number) public {
                        numbers.push(_number);
                    }
                    
                    function sum() public view returns (uint256) {
                        uint256 total = 0;
                        for (uint256 i = 0; i < numbers.length; i++) {
                            total += numbers[i];
                        }
                        return total;
                    }
                }`}
                </code>
              </pre>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5" />
              <span>
                Complete until <b>{endDate?.toUTCString()} </b> to be eligible for rewards
              </span>
            </div>
          </div>

          <div className="card-body w-full">
            {exercise.completed ? (
              <div className={"alert alert-success w-ful mt-6 mx-auto"}>
                <div className="flex-1">
                  <CheckCircle className="w-6 h-6 mr-2" />

                  <label>You have completed this exercise!</label>
                </div>
              </div>
            ) : (
              <>
                <h3 className="card-title text-lg mb-4">Your Solution</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Type tour transaction hash here"
                    className="input w-full max-w-xs"
                    required
                    value={transactionHash}
                    onChange={onTransactionHashChange}
                  />
                  <button onClick={onSubmit} disabled={!authenticated} className="btn btn-primary">
                    Submit Solution
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}
