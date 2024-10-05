/* eslint-disable react/jsx-key */
import { frames } from "./frames";
import { Button } from "frames.js/next";
import { BASE_URL } from "~~/constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleRequest = frames(async ctx => {
  return {
    image: <h3 style={{ textAlign: "center" }}>Onchain Advent - Exercise of the Day</h3>,
    buttons: [
      <Button action="link" target={`${BASE_URL}/exercises/today`}>
        Go To Exercise of the day!
      </Button>
    ]
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
