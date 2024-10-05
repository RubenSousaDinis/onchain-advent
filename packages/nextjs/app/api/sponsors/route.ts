import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";
import { getWalletPassport } from "~~/app/talent_protocol/client";
import { DEPLOYED_CONTRACTS_JSON_RPC_URL } from "~~/constants";
import { currentDateAsCCMMDD } from "~~/utils/dateUtils";

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

  console.debug("Transaction", transaction);

  const valueInWei = transaction.value;
  const valueInEth = Number(valueInWei) / 1e18;
  const wallet = transaction.from;

  const supabase = createSupabaseClient();

  console.debug("About to search into the database for sponsor with wallet", wallet);

  const { data: sponsor, error: sponsorError } = await supabase
    .from("sponsors")
    .select()
    .eq("wallet", wallet)
    .maybeSingle();

  if (sponsorError) {
    console.error("sponsorError", sponsorError);

    return NextResponse.json({ error: sponsorError.message }, { status: 400 });
  }

  console.debug("searching for sponsor didn't return error");

  let returnData = null;
  if (sponsor) {
    console.debug("we found a sponsor", sponsor);

    const updateParams = {
      total_amount: sponsor.total_amount + valueInEth,
      last_sponsor_at: currentDateAsCCMMDD()
    };

    const { data: updatedSponsor, error } = await supabase
      .from("sponsors")
      .update(updateParams)
      .eq("id", sponsor.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    returnData = updatedSponsor;
  } else {
    console.debug("we didn't find a sponsor");

    const { passport } = await getWalletPassport(wallet);

    let createParams = {
      talent_passport_id: null,
      builder_score: null,
      bio: null,
      name: null,
      profile_picture_url: null,
      total_amount: valueInEth,
      last_sponsor_at: currentDateAsCCMMDD(),
      wallet
    };

    if (passport) {
      createParams = {
        talent_passport_id: passport.id,
        builder_score: passport.score,
        bio: passport.passport_profile.bio,
        name: passport.passport_profile.display_name,
        profile_picture_url: passport.passport_profile.image_url,
        total_amount: valueInEth,
        last_sponsor_at: currentDateAsCCMMDD(),
        wallet
      };
    }

    const response = await supabase.from("sponsors").insert(createParams).select().maybeSingle();

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: 400 });
    }

    returnData = response.data;
  }

  // TODO: call talent API to fetch data

  return NextResponse.json({ data: returnData });
}
