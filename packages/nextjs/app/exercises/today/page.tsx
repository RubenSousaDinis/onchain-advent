import { redirect } from "next/navigation";
import { createSupabaseClient } from "~~/app/supabase/server";
import { currentDateAsCCMMDD } from "~~/utils/dateUtils";

const Page = async () => {
  const supabase = createSupabaseClient();

  const { data: exercise, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("date", currentDateAsCCMMDD())
    .maybeSingle();

  if (error) {
    console.error("error", error);
    return <div>Error {`${error}`}</div>;
  } else if (exercise) {
    redirect(`/exercises/${exercise.id}`);
  } else {
    return <div>No exercise today</div>;
  }
};

export default Page;
