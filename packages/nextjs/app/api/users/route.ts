import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("Body", body);
  // const wallet = body.wallet;

  return NextResponse.json({ message: "This is a POST request" });
}
