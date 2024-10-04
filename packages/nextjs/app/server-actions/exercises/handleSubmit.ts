"use server";

import { redirect } from "next/navigation";

// Define a server action
async function handleFormSubmit(formData: FormData) {
  const contractAddress = formData.get("contractAddress") as string;

  console.debug("contractAddress", contractAddress);

  redirect("/exercises/submissionResponse");
}

export default handleFormSubmit;
