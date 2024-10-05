"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { base, baseSepolia } from "viem/chains";
import { http } from "wagmi";
import { Header } from "~~/components/Header";
import { ThemeProvider } from "~~/components/ThemeProvider";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem>
      <PrivyProvider
        appId="cm1uxrccv019j8fycxvej61ov"
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "https://your-logo-url"
          },
          embeddedWallets: {
            createOnLogin: "users-without-wallets"
          },
          defaultChain: baseSepolia,
          supportedChains: [base, baseSepolia]
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="container mx-auto mt-6">{children}</main>
            </div>
            <Toaster />
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
