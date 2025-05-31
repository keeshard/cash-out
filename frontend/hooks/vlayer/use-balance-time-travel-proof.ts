import { useCallProver, useWaitForProvingResult } from "@vlayer/react";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CallProverError } from "@/lib/errors";
import { CASH_OUT_PROVER_ABI, CASH_OUT_PROVER_ADDRESS } from "@/lib/constants";
import { sepolia } from "viem/chains";
import { Abi } from "viem";

export const useBalanceTimeTravelProof = () => {
  const [, setProverResult] = useLocalStorage("proverResult", "");

  const {
    callProver,
    data: provingHash,
    error: provingError,
  } = useCallProver({
    address: CASH_OUT_PROVER_ADDRESS,
    proverAbi: CASH_OUT_PROVER_ABI as Abi,
    functionName: "proveBasic",
    gasLimit: 10000000,
    chainId: sepolia.id,
  });

  if (provingError) {
    throw new CallProverError(provingError.message);
  }

  const { data: result, error: provingResultError } =
    useWaitForProvingResult(provingHash);

  if (provingResultError) {
    throw new CallProverError(provingResultError.message);
  }

  useEffect(() => {
    if (result && Array.isArray(result)) {
      console.log("result", result);
      setProverResult(
        JSON.stringify(result, (key, value) => {
          if (typeof value === "bigint") {
            return String(value);
          }
          return value as string;
        })
      );
    }
  }, [result]);

  return { callProver, provingHash, result };
};
