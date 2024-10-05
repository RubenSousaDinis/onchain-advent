import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import { fetchMetadata } from "frames.js/next";
import { BASE_URL } from "~~/constants";
import "~~/styles/globals.css";

export async function generateMetadata() {
  return {
    title: "Exercise of the Day - Onchain Advent",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(new URL("/frames", BASE_URL))
  };
}

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
