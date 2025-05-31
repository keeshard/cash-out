import { Card, CardContent } from "@/components/ui/card";
import { useBinanceWebProof } from "@/hooks/vlayer/use-binance-web-proof";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import GenerateProofComponent from "../test-proof/generate";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";

export default function BinanceProofComponent({
  creditAmount,
  setCreditAmount,
}: {
  creditAmount: number;
  setCreditAmount: (amount: number) => void;
}) {
  const { user } = usePrivy();
  const {
    requestWebProof: requestBinanceWebProof,
    webProof: binanceWebProof,
    callProver: callBinanceProver,
    isPending: isBinancePending,
    isCallProverIdle: isBinanceCallProverIdle,
    isWaitingForProvingResult: isBinanceWaitingForProvingResult,
    commitmentTxHash: binanceCommitmentTxHash,
    txHash: binanceTxHash,
    result: binanceResult,
  } = useBinanceWebProof();

  useEffect(() => {
    if (
      binanceWebProof &&
      isBinanceCallProverIdle &&
      user &&
      user.wallet &&
      user.wallet.address
    ) {
      void callBinanceProver([binanceWebProof, user.wallet.address]);
    }
  }, [binanceWebProof, user, callBinanceProver, isBinanceCallProverIdle]);

  useEffect(() => {
    if (binanceResult && binanceCommitmentTxHash && binanceTxHash) {
      console.log("Binance result:", binanceResult);
      console.log("Binance commitment tx hash:", binanceCommitmentTxHash);
      console.log("Binance tx hash:", binanceTxHash);

      (async function () {
        console.log("Upgrading credit amount");
        await fetch("/api/businesses/upgrade", {
          method: "POST",
          body: JSON.stringify({
            wallet: user?.wallet?.address,
            amount: formatUnits(
              BigInt((binanceResult as any)[2].toString()),
              18
            ),
          }),
        });
        console.log("Credit amount upgraded");
        setCreditAmount(
          creditAmount +
            parseFloat(
              formatUnits(BigInt((binanceResult as any)[2].toString()), 18)
            )
        );
      })();
    }
  }, [binanceResult, binanceCommitmentTxHash, binanceTxHash]);

  return (
    <GenerateProofComponent
      isGeneratingProof={isBinancePending}
      handleGenerateProof={() => {
        requestBinanceWebProof();
      }}
      selectedProofMethod="binance"
    />
  );
}
