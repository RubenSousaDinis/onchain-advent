import { ethers } from "ethers";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";
import { DEPLOYED_CONTRACTS_JSON_RPC_URL } from "~~/constants";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const transactionHash = body.transactionHash;
  const privyUserId = body.privyId;
  const exerciseId = params.id;

  const supabase = createSupabaseClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("privy_id", privyUserId)
    .maybeSingle();

  if (userError) {
    console.error("error", userError);
    return new Response(`Error: ${userError}`, { status: 401 });
  }

  console.debug("transactionHash", transactionHash, "exerciseId", exerciseId);

  const { data: exercise, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).maybeSingle();

  console.error("error", error);

  if (error) {
    return new Response(`Error: ${error}`, { status: 422 });
  }

  const abi = [exercise.function_abi];
  const functionName = abi[0].match(/function (\w+)/)[1];

  try {
    const provider = new ethers.JsonRpcProvider(DEPLOYED_CONTRACTS_JSON_RPC_URL);
    const receipt = await provider.getTransactionReceipt(transactionHash);

    if (!receipt) {
      return NextResponse.json({ submission: "Transaction hash does not exist", status: 400 });
    }
    const contractAddress = receipt.contractAddress;

    if (!contractAddress) {
      return NextResponse.json({ submission: "Transaction hash does not deploy a smart contract", status: 400 });
    }

    if (receipt.from != user.wallet) {
      return NextResponse.json({ submission: "Transaction hash must be your privy wallet", status: 400 });
    }

    // TODO validate privy wallet
    const contract = new ethers.Contract(contractAddress as string, abi, provider);

    const response = await contract[functionName]();

    // I need somehow confirm that the function call has done the work

    console.debug("response", response);

    const expectedResponse = exercise.function_expected_return;

    if (expectedResponse === response) {
      return NextResponse.json({ submission: "success", status: 200 });
    } else {
      return NextResponse.json({ submission: "failure", status: 200 });
    }
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: `Error: ${e}` }), { status: 422 });
  }
}
