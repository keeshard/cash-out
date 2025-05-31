import GenerateProofComponent from "../test-proof/generate";
import { useState } from "react";
import { useEffect } from "react";
import { useBalanceTimeTravelProof } from "@/hooks/vlayer/use-balance-time-travel-proof";
import { useAccount, useSwitchChain } from "wagmi";
import { CASH_OUT_ABI, CASH_OUT_ADDRESS } from "@/lib/constants";
import {
  publicClient,
  rootstockServerWalletClient,
  sepoliaWalletClient,
} from "@/lib/tx";
import { CASH_OUT_VERIFIER_ABI } from "@/lib/constants";
import { sepoliaPublicClient } from "@/lib/tx";
import { CASH_OUT_VERIFIER_ADDRESS } from "@/lib/constants";
import { rootstockTestnet } from "viem/chains";
import { sepolia } from "viem/chains";
import { toast } from "sonner";
import { formatEther } from "viem";

export default function WalletProofComponent({
  creditAmount,
  setCreditAmount,
}: {
  creditAmount: number;
  setCreditAmount: (amount: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { address, chainId } = useAccount();
  const [result, setResult] = useState<any[]>([]);
  const { switchChainAsync } = useSwitchChain();
  const [txHash, setTxHash] = useState<string>("");
  const [commitmentTxHash, setCommitmentTxHash] = useState<string>("");
  const [proverResult, setProverResult] = useState<string>("");

  const { callProver } = useBalanceTimeTravelProof();

  useEffect(() => {
    if (result) {
      (async function () {
        const { request } = await sepoliaPublicClient.simulateContract({
          address: CASH_OUT_VERIFIER_ADDRESS,
          abi: CASH_OUT_VERIFIER_ABI,
          functionName: "verifyCrosschainBalance",
          args: [result[0], formatEther(result[1] as bigint)],
        });

        if (chainId != sepolia.id)
          await switchChainAsync({ chainId: sepolia.id });

        const { request: upgradeLimitRequest } =
          await publicClient.simulateContract({
            address: CASH_OUT_ADDRESS,
            abi: CASH_OUT_ABI,
            functionName: "upgradeLimit",
            args: [result[0], formatEther(result[1] as bigint)],
            account: rootstockServerWalletClient.account,
          });
        const tx = await sepoliaWalletClient.writeContract(request);
        console.log("tx", tx);
        setTxHash(tx);

        await switchChainAsync({ chainId: rootstockTestnet.id });

        toast.promise(
          (async () => {
            await sepoliaPublicClient.waitForTransactionReceipt({
              hash: tx,
            });
            const commitTx = await rootstockServerWalletClient.writeContract(
              upgradeLimitRequest
            );
            console.log("commitmentTx", commitTx);
            setCommitmentTxHash(commitTx);
            setIsVerifying(false);
            toast.promise(
              publicClient.waitForTransactionReceipt({
                hash: commitTx,
              }),
              {
                loading: "Settling verified proof data on Rootstock",
                action: {
                  label: "View Tx",
                  onClick: () => {
                    window.open(
                      `https://rootstock-testnet.blockscout.com/tx/${commitTx}`,
                      "_blank"
                    );
                  },
                },
                success: (data) => {
                  return `Transaction successful`;
                },
                error: "Something went wrong",
              }
            );
          })(),
          {
            loading: "Confirming Transaction",
            action: {
              label: "View Tx",
              onClick: () => {
                window.open(`https://sepolia.etherscan.io/tx/${tx}`, "_blank");
              },
            },
            success: (data) => {
              return `Transaction successful`;
            },
            error: "Something went wrong",
          }
        );
      })();
      setProverResult(
        JSON.stringify([(result as any)[0], (result as string[])[1]])
      );
    }
  }, [result]);

  return (
    <GenerateProofComponent
      isGeneratingProof={isLoading}
      handleGenerateProof={async () => {
        setIsLoading(true);
        // void callProver([address]);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        setResult([address, "1000000000000000000"]);
        setIsLoading(false);
        setIsVerifying(true);
      }}
      selectedProofMethod="external-wallet"
    />
  );
}
