"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { rootstockTestnet, rootstock } from "viem/chains";
import { ProofProvider } from "@vlayer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { config } from "@/lib/wagmi-config";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
      config={{
        appearance: {
          theme: "dark",
          logo: "https://cash-out-invoices.vercel.app/logo.png",
          accentColor: "#FACC15",
          walletChainType: "ethereum-only",
          walletList: ["metamask", "rainbow"],
        },
        loginMethods: ["wallet"],
        supportedChains: [
          JSON.parse(process.env.NEXT_PUBLIC_IS_MAINNET || "false")
            ? rootstock
            : rootstockTestnet,
        ],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ProofProvider
            config={{
              proverUrl: process.env.NEXT_PUBLIC_PROVER_URL || "",
              wsProxyUrl: process.env.NEXT_PUBLIC_WS_PROXY_URL || "",
              notaryUrl: process.env.NEXT_PUBLIC_NOTARY_URL || "",
              token:
                process.env.NEXT_PUBLIC_CURRENT_WEB_PROVER === "binance"
                  ? process.env.NEXT_PUBLIC_VLAYER_BINANCE_API_TOKEN || ""
                  : process.env.NEXT_PUBLIC_VLAYER_BYBIT_API_TOKEN || "",
            }}
          >
            {children}
          </ProofProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
