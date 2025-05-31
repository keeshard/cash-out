import { createPublicClient, http } from "viem";
import { optimismSepolia, baseSepolia } from "viem/chains";

const THREE_WEEKS_IN_SECONDS = 60 * 60 * 24 * 7 * 3;
const targetTimestamp = Math.floor(Date.now() / 1000) - THREE_WEEKS_IN_SECONDS;

async function findBlockAtTimestamp(
  client: ReturnType<typeof createPublicClient>,
  label: string
) {
  const latestBlockNumber = await client.getBlockNumber();
  let low = 0n;
  let high = latestBlockNumber;
  let result = latestBlockNumber;

  while (low <= high) {
    const mid = (low + high) / 2n;
    const block = await client.getBlock({ blockNumber: mid });

    if (!block?.timestamp) break;

    const ts = Number(block.timestamp);

    if (ts < targetTimestamp) {
      low = mid + 1n;
    } else {
      result = mid;
      high = mid - 1n;
    }
  }

  console.log(`${label} block from ~3 weeks ago:`, result.toString());
  return result;
}

async function main() {
  const optimismClient = createPublicClient({
    chain: optimismSepolia,
    transport: http(),
  });

  const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  await findBlockAtTimestamp(optimismClient, "Optimism Sepolia");
  await findBlockAtTimestamp(baseClient, "Base Sepolia");
}

main().catch(console.error);
