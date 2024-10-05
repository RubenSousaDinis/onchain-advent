import { ethers } from "ethers";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";
import { DEPLOYED_CONTRACTS_JSON_RPC_URL, ENV } from "~~/constants";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const headers = request.headers;

  const privyUserId = headers.get("x-privy-user-id");

  const transactionHash = body.transactionHash;
  const exerciseId = params.id;

  const supabase = createSupabaseClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("privy_id", privyUserId)
    .maybeSingle();

  if (userError) {
    console.error("error", userError);
    return NextResponse.json({ error: userError.message }, { status: 401 });
  }

  const { data: exercise, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).maybeSingle();

  if (error) {
    console.error("error", error);
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select()
    .eq("user_id", user.id)
    .eq("exercise_id", exercise.id)
    .maybeSingle();

  if (submissionError) {
    console.error("error", submissionError);
    return NextResponse.json({ error: submissionError.message }, { status: 422 });
  }

  if (submission?.deployed_at) {
    return NextResponse.json({ error: "You have already completed this exercise" }, { status: 422 });
  }

  const abi = [exercise.function_abi];
  const functionName = abi[0].match(/function (\w+)/)[1];

  try {
    const provider = new ethers.JsonRpcProvider(DEPLOYED_CONTRACTS_JSON_RPC_URL);
    const receipt = await provider.getTransactionReceipt(transactionHash);

    if (!receipt) {
      return NextResponse.json({ error: "Transaction hash does not exist" }, { status: 400 });
    }
    const contractAddress = receipt.contractAddress;

    if (!contractAddress) {
      return NextResponse.json({ error: "Transaction hash does not deploy a smart contract" }, { status: 400 });
    }

    if (receipt.from != user.wallet && ENV != "development") {
      return NextResponse.json({ error: "Transaction hash must be your privy wallet" }, { status: 400 });
    }

    // TODO validate privy wallet
    const contract = new ethers.Contract(contractAddress as string, abi, provider);

    const response = await contract[functionName]();

    // I need somehow confirm that the function call has done the work

    const expectedResponse = exercise.function_expected_return;

    if (expectedResponse != response) {
      return NextResponse.json({ error: "Function output does not match expected" }, { status: 400 });
    }

    const block = await provider.getBlock(receipt.blockNumber);

    const submissionResponse = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        exercise_id: exercise.id,
        contract_address: contractAddress,
        transaction_hash: transactionHash,
        deployed_at: block?.timestamp ? new Date(block.timestamp * 1000) : null
      })
      .select();

    if (submissionResponse.error) {
      return NextResponse.json({ error: submissionResponse.error.message }, { status: 400 });
    }
    return NextResponse.json({ submission: submissionResponse.data, status: 200 });
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: `Error: ${e}` }), { status: 422 });
  }
}
