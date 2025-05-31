import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import GenerateProofComponent from "../test-proof/generate";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import { useBybitWebProof } from "@/hooks/vlayer/use-bybit-web-proof";

export default function BybitProofComponent({
  creditAmount,
  setCreditAmount,
}: {
  creditAmount: number;
  setCreditAmount: (amount: number) => void;
}) {
  const { user } = usePrivy();
  const {
    requestWebProof: requestBybitWebProof,
    webProof: bybitWebProof,
    callProver: callBybitProver,
    isPending: isBybitPending,
    isCallProverIdle: isBybitCallProverIdle,
    isWaitingForProvingResult: isBybitWaitingForProvingResult,
    commitmentTxHash: bybitCommitmentTxHash,
    txHash: bybitTxHash,
    result: bybitResult,
  } = useBybitWebProof();

  useEffect(() => {
    if (
      bybitWebProof &&
      isBybitCallProverIdle &&
      user &&
      user.wallet &&
      user.wallet.address
    ) {
      void callBybitProver([bybitWebProof, user.wallet.address]);
    }
  }, [bybitWebProof, user, callBybitProver, isBybitCallProverIdle]);

  useEffect(() => {
    if (bybitResult && bybitCommitmentTxHash && bybitTxHash) {
      console.log("Bybit result:", bybitResult);
      console.log("Bybit commitment tx hash:", bybitCommitmentTxHash);
      console.log("Bybit tx hash:", bybitTxHash);

      (async function () {
        console.log("Upgrading credit amount");
        await fetch("/api/businesses/upgrade", {
          method: "POST",
          body: JSON.stringify({
            wallet: user?.wallet?.address,
            amount: formatUnits(BigInt((bybitResult as any)[2].toString()), 18),
          }),
        });
        console.log("Credit amount upgraded");
        setCreditAmount(
          creditAmount +
            parseFloat(
              formatUnits(BigInt((bybitResult as any)[2].toString()), 18)
            )
        );
      })();
    }
  }, [bybitResult, bybitCommitmentTxHash, bybitTxHash]);

  return (
    <GenerateProofComponent
      isGeneratingProof={isBybitPending}
      handleGenerateProof={() => {
        requestBybitWebProof();
      }}
      selectedProofMethod="binance"
    />
  );
}
