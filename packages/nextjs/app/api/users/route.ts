import { type NextRequest, NextResponse } from "next/server";
import privyClient from "~~/app/privy/client";
import { createClient } from "~~/app/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const privyUser = await privyClient.getUser(body.privy_id);
  if (!privyUser) {
    return NextResponse.json({ error: 401 });
  }

  console.log("Body", body);
  console.log("privyUser", privyUser);
  // const wallet = body.wallet;

  const supabase = createClient();
  const { data, error } = await supabase.from("users").select().eq("privy_id", privyUser.id);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  if (data) {
    return NextResponse.json({ data });
  }

  const embeddedWallet = privyUser.wallet;

  if (!embeddedWallet) {
    return NextResponse.json({ error: "Privy Embedded wallet not found" });
  }
  const wallet = embeddedWallet.address.toLowerCase();

  const response = await supabase.from("users").insert({ privy_id: privyUser.id, wallet }).select();

  if (response.error) {
    return NextResponse.json({ error: response.error.message });
  }

  return NextResponse.json({ data: response.data });
}
