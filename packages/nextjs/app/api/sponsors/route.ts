import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";
import { getWalletPassport } from "~~/app/talent_protocol/client";
import { DEPLOYED_CONTRACTS_JSON_RPC_URL } from "~~/constants";

export async function GET() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("sponsors").select().order("total_amount");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data) {
    return NextResponse.json({ data });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const transactionHash = body.transactionHash;

  const provider = new ethers.JsonRpcProvider(DEPLOYED_CONTRACTS_JSON_RPC_URL);
  const transaction = await provider.getTransaction(transactionHash);

  if (!transaction) {
    return NextResponse.json({ error: "Transaction hash does not exist" }, { status: 400 });
  }
  const valueInWei = transaction.value;
  const valueInEth = ethers.formatEther(valueInWei);
  const wallet = transaction.from;

  const supabase = createSupabaseClient();

  const { data: sponsor, error: sponsorError } = await supabase
    .from("sponsors")
    .select()
    .eq("wallet", wallet)
    .maybeSingle();

  if (sponsorError) {
    return NextResponse.json({ error: sponsorError.message }, { status: 400 });
  }

  let returnData = null;
  if (sponsor) {
    const updateParams = {
      total_amount: sponsor.total_amount + valueInEth,
      last_sponsor_at: Date.now()
    };

    const { data: updatedSponsor, error } = await supabase
      .from("sponsors")
      .update(updateParams)
      .eq("id", sponsor.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    returnData = updatedSponsor;
  } else {
    const { passport } = await getWalletPassport(wallet);
    let createParams = {
      talent_passport_id: null,
      builder_score: null,
      bio: null,
      name: null,
      profile_picture_url: null,
      total_amount: sponsor.total_amount + valueInEth,
      last_sponsor_at: Date.now()
    };

    if (passport) {
      createParams = {
        talent_passport_id: passport.id,
        builder_score: passport.score,
        bio: passport.passport_profile.bio,
        name: passport.passport_profile.display_name,
        profile_picture_url: passport.passport_profile.image_url,
        total_amount: sponsor.total_amount + valueInEth,
        last_sponsor_at: Date.now()
      };
    }

    const response = await supabase.from("sponsors").insert(createParams).select();

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: 400 });
    }

    returnData = response.data;
  }

  // TODO: call talent API to fetch data

  return NextResponse.json({ data: returnData });
}
