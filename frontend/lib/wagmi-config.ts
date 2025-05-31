import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { rootstockTestnet, sepolia } from "viem/chains";

export const config = createConfig({
  chains: [rootstockTestnet, sepolia],
  transports: {
    [rootstockTestnet.id]: http(
      `https://rootstock-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [sepolia.id]: http(
      `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});
