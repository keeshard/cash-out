import { useEffect, useState } from "react";
import {
  useCallProver,
  useWaitForProvingResult,
  useWebProof,
} from "@vlayer/react";
import { useLocalStorage } from "usehooks-ts";
import { WebProofConfig, ProveArgs } from "@vlayer/sdk";
import { Abi, ContractFunctionName } from "viem";
import { rootstockTestnet, sepolia } from "viem/chains";
import { startPage, expectUrl, notarize } from "@vlayer/sdk/web_proof";
import { WebProofError } from "@/lib/errors";
import {
  CASH_OUT_ABI,
  CASH_OUT_ADDRESS,
  CASH_OUT_PROVER_ABI,
  CASH_OUT_PROVER_ADDRESS,
  CASH_OUT_VERIFIER_ABI,
  CASH_OUT_VERIFIER_ADDRESS,
} from "@/lib/constants";
import {
  publicClient,
  rootstockServerWalletClient,
  sepoliaPublicClient,
  sepoliaWalletClient,
} from "@/lib/tx";
import { useAccount, useSwitchChain } from "wagmi";
import { toast } from "sonner";

const vlayerProverConfig: Omit<
  ProveArgs<Abi, ContractFunctionName<Abi>>,
  "args"
> = {
  address: CASH_OUT_PROVER_ADDRESS,
  proverAbi: CASH_OUT_PROVER_ABI as Abi,
  chainId: sepolia.id,
  functionName: "proveBybitFunds",
};

const webProofConfig: WebProofConfig<Abi, string> = {
  proverCallCommitment: {
    address: "0x0000000000000000000000000000000000000000",
    proverAbi: [],
    functionName: "proveWeb",
    commitmentArgs: [],
    chainId: 1,
  },
  logoUrl:
    "https://pbs.twimg.com/profile_images/1894706611538530304/w9AEcEL8_400x400.jpg",
  steps: [
    startPage(
      "https://www.bybit.com/user/assets/home/overview",
      "Go to ByBit portfolio"
    ),
    notarize(
      "https://api2.bybit.com/v3/private/cht/asset-show/asset-total-balance?quoteCoin=BTC",
      "GET",
      "Generate Proof of Bybit assets",
      [
        {
          request: {
            headers_except: [],
          },
        },
        {
          response: {
            headers_except: [],
          },
        },
      ]
    ),
  ],
};
export const useBybitWebProof = () => {
  const {
    requestWebProof,
    webProof,
    isPending: isWebProofPending,
    error: webProofError,
  } = useWebProof(webProofConfig);
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [commitmentTxHash, setCommitmentTxHash] = useState<string | null>(null);

  if (webProofError) {
    console.log("webProofError", webProofError);
    throw new WebProofError(webProofError.message);
  }

  const {
    callProver,
    isPending: isCallProverPending,
    isIdle: isCallProverIdle,
    data: hash,
    error: callProverError,
  } = useCallProver(vlayerProverConfig);

  if (callProverError) {
    throw callProverError;
  }

  const {
    isPending: isWaitingForProvingResult,
    data: result,
    error: waitForProvingResultError,
  } = useWaitForProvingResult(hash);

  if (waitForProvingResultError) {
    throw waitForProvingResultError;
  }

  const [, setWebProof] = useLocalStorage("webProof", "");
  const [, setProverResult] = useLocalStorage("proverResult", "");

  useEffect(() => {
    if (webProof) {
      console.log("webProof", webProof);
      setWebProof(JSON.parse(webProof.webProofJson));
    }
  }, [webProof]);

  useEffect(() => {
    if (result) {
      console.log("proverResult", result);
      (async function () {
        const { request } = await sepoliaPublicClient.simulateContract({
          address: CASH_OUT_VERIFIER_ADDRESS,
          abi: CASH_OUT_VERIFIER_ABI,
          functionName: "verifyBybitFunds",
          args: result as any[],
        });

        if (chainId != sepolia.id)
          await switchChainAsync({ chainId: sepolia.id });

        const { request: upgradeLimitRequest } =
          await publicClient.simulateContract({
            address: CASH_OUT_ADDRESS,
            abi: CASH_OUT_ABI,
            functionName: "upgradeLimit",
            args: [(result as string[])[1], (result as string[])[2]],
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
      setProverResult(JSON.stringify(result));
    }
  }, [result]);

  return {
    requestWebProof,
    webProof,
    isPending:
      isWebProofPending || isCallProverPending || isWaitingForProvingResult,
    isCallProverIdle,
    isWaitingForProvingResult,
    isWebProofPending,
    callProver,
    result,
    txHash,
    commitmentTxHash,
  };
};
