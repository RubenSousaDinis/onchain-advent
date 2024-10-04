import handleFormSubmit from "~~/app/server-actions/exercises/handleSubmit";
import { createSupabaseClient } from "~~/app/supabase/server";

export default async function Exercise({ params }: { params: { id: string } }) {
  const supabase = createSupabaseClient();

  const { data: exercises, error } = await supabase.from("exercises").select("*").eq("id", parseInt(params.id));

  console.debug("exercises", exercises);

  if (error) {
    console.error(error);
    return (
      <div>
        <h1>Error: {`${error}`}</h1>
      </div>
    );
  } else {
    const exercise = exercises[0];

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
