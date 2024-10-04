"use server";

import { createSupabaseClient } from "../supabase/server";
import Link from "next/link";

export default async function Page() {
  const supabase = createSupabaseClient();

  const { data: exercises, error } = await supabase.from("exercises").select("*");

  console.debug("exercises", exercises);

  if (error) {
    console.error("Error fetching exercises", error);
    return <div>Error</div>;
  } else {
    return (
      <div>
        <h1>List of Exercises</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link href={`/exercises/${exercise.id}`}>{exercise.id}</Link>
                  </td>
                  <td>{exercise.date}</td>
                  <td>{exercise.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
