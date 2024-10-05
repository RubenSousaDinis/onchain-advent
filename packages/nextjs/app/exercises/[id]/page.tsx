"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { type IExercise } from "~~/types/IExercise";

export default function Exercise({ params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;
  const [exercise, setExercise] = useState<IExercise>();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successSubmissionMessage, setSuccessSubmissionMessage] = useState("");
  const { authenticated, user } = usePrivy();

  const onSubmit = () => {
    console.debug("Submitting.............");
    // Clear previous messages
    setErrorMessage("");
    setSuccessSubmissionMessage("");

    const data = {
      transactionHash,
      privyId: user?.id
    };

    (async () => {
      try {
        const result = await fetch(`/api/exercises/${exerciseId}/submissions`, {
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

        if (result.ok) {
          if (body.submission === "success") {
            setSuccessSubmissionMessage("Well Done! You have successfully completed this challenge!");
          }
          if (body.submission === "failure") {
            setErrorMessage("Unfortunately, your solution was not correct. Do you want to try again?");
          }
        } else {
          setErrorMessage(`Error processing your submission: ${body.error}`);
        }
      } catch (e) {
        console.error("error from submission", e);
        setErrorMessage(`Error processing your submission: ${e}`);
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
      const { data: exercise } = await result.json();
      console.debug("exercise", exercise);
      setExercise(exercise);
    })();
  }, [exerciseId]);

  if (!exercise) {
    return <div>Exercise ...</div>;
  } else {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{exercise.id}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{exercise.date}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{exercise.description}</td>
            </tr>
          </tbody>
        </table>

        <h1>Submit your solution by giving the transaction hash that deployed your contract</h1>

        <div>
          <label htmlFor="transactionHash">Transaction hash:</label>
          <input
            type="text"
            id="transactionHash"
            name="transactionHash"
            required
            value={transactionHash}
            onChange={onTransactionHashChange}
          />
        </div>
        <button onClick={onSubmit} disabled={!authenticated}>
          Submit
        </button>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {!authenticated && <p style={{ color: "red" }}>You have to be logged in to submit your solution.</p>}

        {successSubmissionMessage && <p style={{ color: "green" }}>{successSubmissionMessage}</p>}
      </div>
    );
  }
}
