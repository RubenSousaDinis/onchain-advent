import { ethers } from "ethers";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseClient } from "~~/app/supabase/server";
import { DEPLOYED_CONTRACTS_JSON_RPC_URL } from "~~/constants";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const contractAddress = body.contractAddress;
  const exerciseId = params.id;

  console.debug("contractAddress", contractAddress, "exerciseId", exerciseId);

  const supabase = createSupabaseClient();

  const { data: exercise, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).maybeSingle();

  console.error("error", error);

  if (error) {
    return new Response(`Error: ${error}`, { status: 422 });
  }

  const abi = [exercise.function_abi];
  const functionName = abi[0].match(/function (\w+)/)[1];

  try {
    const provider = new ethers.JsonRpcProvider(DEPLOYED_CONTRACTS_JSON_RPC_URL);
    const contract = new ethers.Contract(contractAddress, abi, provider);

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
