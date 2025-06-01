import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { useCallProver, useWaitForProvingResult } from "@vlayer/react";
import { preverifyEmail } from "@vlayer/sdk";
import { Abi, Address } from "viem";
import {
  AlreadyMintedError,
  NoProofError,
  CallProverError,
  PreverifyError,
} from "@/lib/errors";
import { rootstock, rootstockTestnet, sepolia } from "viem/chains";
import {
  CASH_OUT_VERIFIER_ABI,
  CASH_OUT_VERIFIER_ADDRESS,
  EMAIL_PROVER_ABI,
} from "@/lib/constants";
import { publicClient, rootstockServerWalletClient } from "@/lib/tx";

enum ProofVerificationStep {
  READY = "Ready",
  SENDING_TO_PROVER = "Sending to prover...",
  WAITING_FOR_PROOF = "Waiting for proof...",
  VERIFYING_ON_CHAIN = "Verifying on-chain...",
  DONE = "Done!",
}

export const useEmailProofVerification = () => {
  const { address, chainId } = useAccount();
  const [prover, setProver] = useState<string>("");
  const { data: balance } = useBalance({ address });
  const [currentStep, setCurrentStep] = useState<ProofVerificationStep>(
    ProofVerificationStep.READY
  );
  const { switchChainAsync } = useSwitchChain();

  const {
    writeContract,
    data: txHash,
    error: verificationError,
    status,
  } = useWriteContract();

  const { status: onChainVerificationStatus } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const {
    callProver,
    data: proofHash,
    error: callProverError,
  } = useCallProver({
    address: "0xb3637240da1855ec4c43dA2122A6A3bae4D91f17",
    proverAbi: EMAIL_PROVER_ABI as Abi,
    functionName: "proveInvoiceEmail",
    gasLimit: 10000000,
    chainId: sepolia.id,
  });

  if (callProverError) {
    throw new CallProverError(callProverError.message);
  }

  const { data: proof, error: provingError } =
    useWaitForProvingResult(proofHash);

  if (provingError) {
    throw new CallProverError(provingError.message);
  }

  const verifyProofOnChain = async () => {
    setCurrentStep(ProofVerificationStep.VERIFYING_ON_CHAIN);

    if (!proof) {
      throw new NoProofError("No proof available to verify on-chain");
    }

    const contractArgs: Parameters<typeof writeContract>[0] = {
      address: CASH_OUT_VERIFIER_ADDRESS,
      abi: CASH_OUT_VERIFIER_ABI,
      functionName: "claimInvoiceAmount",
      args: [proof, prover],
    };

    if (chainId != sepolia.id) {
      await switchChainAsync({ chainId: sepolia.id });
    }
    writeContract(contractArgs);
  };

  const [preverifyError, setPreverifyError] = useState<Error | null>(null);
  const startProving = async (emlContent: string, _prover: string) => {
    setProver(_prover);
    setCurrentStep(ProofVerificationStep.SENDING_TO_PROVER);

    try {
      const email = await preverifyEmail({
        mimeEmail: emlContent,
        dnsResolverUrl: process.env.NEXT_PUBLIC_DNS_SERVICE_URL || "",
        token: process.env.NEXT_PUBLIC_VLAYER_EMAIL_API_TOKEN || "",
      });
      await callProver([email]);
    } catch (error) {
      setPreverifyError(error as Error);
    }
    setCurrentStep(ProofVerificationStep.WAITING_FOR_PROOF);
  };

  useEffect(() => {
    if (proof) {
      console.log("proof", proof);
      void verifyProofOnChain();
    }
  }, [proof]);

  useEffect(() => {
    if (status === "success" && proof) {
      setCurrentStep(ProofVerificationStep.DONE);
      const proofArray = proof as unknown[];
    }
  }, [status]);

  useEffect(() => {
    if (txHash) {
      (async function () {
        if (chainId != rootstockTestnet.id) {
          await switchChainAsync({ chainId: rootstockTestnet.id });
        }
        const { request } = await publicClient.simulateContract({
          address: CASH_OUT_VERIFIER_ADDRESS as Address,
          abi: CASH_OUT_VERIFIER_ABI,
          functionName: "completeInvoiceClaim",
          args: [address as Address, "0", BigInt("2812500000000000000000")],
        });
        const tx = await rootstockServerWalletClient.writeContract(request);
        console.log("tx", tx);
      })();
    }
  }, [txHash]);

  useEffect(() => {
    if (verificationError) {
      if (verificationError.message.includes("already been minted")) {
        throw new AlreadyMintedError();
      }
      throw new Error(verificationError.message);
    }
  }, [verificationError]);

  useEffect(() => {
    if (preverifyError) {
      throw new PreverifyError(preverifyError.message);
    }
  }, [preverifyError]);

  return {
    currentStep,
    txHash,
    proof,
    onChainVerificationStatus,
    verificationError,
    provingError,
    startProving,
  };
};
