import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;
  const headers = request.headers;

  const privyUserId = headers.get("x-privy-user-id");

  const supabase = createSupabaseClient();
  const { data: exercise, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).maybeSingle();

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select("*, exercises(*), users(*)")
    .eq("exercises.id", exerciseId)
    .eq("users.privy_id", privyUserId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (submissionError) {
    console.error(submissionError);
    return NextResponse.json({ error: submissionError.message }, { status: 400 });
  }

  let exerciseData = {};

  if (submission) {
    exerciseData = {
      ...exercise,
      completed: true
    };
  } else {
    exerciseData = {
      ...exercise
    };
  }

  if (exercise) {
    return NextResponse.json({ exercise: exerciseData });
  }

  return new Response(null, {
    status: 404
  });
}
