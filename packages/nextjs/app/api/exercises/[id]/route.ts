import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const exerciseId: number = parseInt(params.id) || 0;

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  if (data) {
    return NextResponse.json({ data });
  }

  return new Response(null, {
    status: 404
  });
}
