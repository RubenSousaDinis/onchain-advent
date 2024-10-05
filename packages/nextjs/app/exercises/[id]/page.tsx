"use client";

import { useEffect, useState } from "react";
import handleFormSubmit from "~~/app/server-actions/exercises/handleSubmit";
import { type IExercise } from "~~/types/IExercise";

export default function Exercise({ params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;
  const [exercise, setExercise] = useState<IExercise>();

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
        </table>

        <h1>Submit your solution by giving the address to your deployed contract</h1>

        <form action={handleFormSubmit}>
          <input type="hidden" value={exercise.id} name="exerciseId" id="exerciseId" />
          <div>
            <label htmlFor="contactAddress">Contract address:</label>
            <input type="text" id="contractAddress" name="contractAddress" required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
