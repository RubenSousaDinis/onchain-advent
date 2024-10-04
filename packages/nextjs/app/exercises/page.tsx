import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const supabase = createClient();

  const { data: exercises, error } = await supabase.from("notes").select("*");

  if (error) {
    console.error("Error fetching exercises", error);
    return <div>Error</div>;
  } else {
    return (
      <div>
        <h1>List of Exercises</h1>
        <table>
          {exercises.map((exercise, index) => {
            <tr key={index}>
              <td>{exercise.id}</td>
            </tr>;
          })}
        </table>
      </div>
    );
  }
};

export default Page;
