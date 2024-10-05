import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import { fetchMetadata } from "frames.js/next";
import { BASE_URL } from "~~/constants";
import "~~/styles/globals.css";

// export const metadata = getMetadata({
//   title: "Onchain Advent",
//   description: "Bring your web2 friend onchain and celebrate Christmas by completing the Onchain Advent"
// });

export async function generateMetadata() {
  const other = await fetchMetadata(new URL("/frames", BASE_URL));
  const main = {
    title: "Exercise of the Day - Onchain Advent"
  };

  console.debug("other", other);

  return {
    ...main,
    other
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
