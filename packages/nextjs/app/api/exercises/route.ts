import { NextResponse } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";

export async function GET() {
  const supabase = createSupabaseClient();
  const { data: exercises, error } = await supabase.from("exercises").select("*").order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ exercises: exercises }, { status: 400 });
  }

  return NextResponse.json({ exercises: exercises });
}
