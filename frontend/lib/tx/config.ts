import {
  createPublicClient,
  createWalletClient,
  custom,
  Hex,
  http,
} from "viem";
import { rootstockTestnet, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export const publicClient = createPublicClient({
  chain: rootstockTestnet,
  transport: http(
    `https://rootstock-testnet.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
    }`
  ),
});

export const sepoliaPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
    }`
  ),
});

export const rootstockWalletClient = createWalletClient({
  chain: rootstockTestnet,
  transport: custom(window.ethereum!),
});

export const rootstockServerWalletClient = createWalletClient({
  account: privateKeyToAccount(
    (process.env.NEXT_PUBLIC_SERVER_WALLET || "0x") as Hex
  ),
  chain: rootstockTestnet,
  transport: http(
    `https://rootstock-testnet.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
    }`
  ),
});

export const sepoliaWalletClient = createWalletClient({
  account: privateKeyToAccount(
    (process.env.NEXT_PUBLIC_SERVER_WALLET || "0x") as Hex
  ),
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
    }`
  ),
});
