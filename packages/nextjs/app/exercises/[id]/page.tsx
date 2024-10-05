"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { type IExercise } from "~~/types/IExercise";

export default function Exercise({ params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;
  const [exercise, setExercise] = useState<IExercise>();
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successSubmissionMessage, setSuccessSubmissionMessage] = useState("");
  const { authenticated } = usePrivy();

  const onSubmit = () => {
    if (!exercise) {
      return;
    }

    console.debug("Submitting.............");

    // Clear previous messages
    setErrorMessage("");
    setSuccessSubmissionMessage("");

    console.debug("contractAddress", contractAddress, "exerciseId", exerciseId);

    const abi = [exercise.function_abi];
    const functionName = abi[0].match(/function (\w+)/)[1];

    (async () => {
      try {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const provider = new ethers.BrowserProvider(window.ethereum);

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(contractAddress, abi, provider);

        const response = await contract[functionName]();

        // I need somehow confirm that the function call has done the work

        console.debug("response", response);

        const expectedResponse = exercise.function_expected_return;

        if (expectedResponse === response) {
          setSuccessSubmissionMessage("Your answer is correct");
        } else {
          setErrorMessage("Your answer is not correct");
        }
      } catch (e) {
        console.error("error", e);
        return setErrorMessage(`Error ${e}`);
      }
    })();
  };

  const onContractAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
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

        <h1>Submit your solution by giving the address to your deployed contract</h1>

        <div>
          <label htmlFor="contactAddress">Contract address:</label>
          <input
            type="text"
            id="contractAddress"
            name="contractAddress"
            required
            value={contractAddress}
            onChange={onContractAddressChange}
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
