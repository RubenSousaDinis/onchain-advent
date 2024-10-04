"use server";

import { ethers } from "ethers";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "~~/app/supabase/server";

// Define a server action
async function handleFormSubmit(formData: FormData) {
  const contractAddress = formData.get("contractAddress") as string;
  const exerciseId = (formData.get("exerciseId") || 0) as number;

  const supabase = createSupabaseClient();

  const { data: exercises, error } = await supabase.from("exercises").select("*").eq("id", exerciseId);

  if (error) {
    redirect("/error");
  }

  const exercise = exercises[0];

  console.debug("contractAddress", contractAddress, "exerciseId", exerciseId);
  const abi = [exercise.function_abi];
  const functionName = abi[0].match(/function (\w+)/)[1];

  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const response = await contract[functionName]();

  // I need somehow confirm that the function call has done the work

  console.debug("response", response);

  const expectedResponse = exercise.function_expected_return;

  if (expectedResponse === response) {
    redirect("/exercises/success");
  } else {
    redirect("/exercises/failure");
  }
}

export default handleFormSubmit;
