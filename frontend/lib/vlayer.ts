import { TOKEN_ADDRESSES } from "./constants";

export function getTokensToProve(
  latestBlockNumber: Record<84532 | 11155420, number>
): {
  chainId: number;
  addr: string;
  startBlock: number;
}[] {
  const tokens = [];
  const baseTokens = TOKEN_ADDRESSES[84532];
  const optimismTokens = TOKEN_ADDRESSES[11155420];

  for (const addr of Object.values(baseTokens)) {
    tokens.push({
      chainId: 84532,
      addr,
      startBlock: latestBlockNumber[84532],
    });
  }

  for (const addr of Object.values(optimismTokens)) {
    tokens.push({
      chainId: 11155420,
      addr,
      startBlock: latestBlockNumber[11155420],
    });
  }

  return tokens;
}
