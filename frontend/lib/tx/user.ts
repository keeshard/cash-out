import { CASH_OUT_ABI, CASH_OUT_ADDRESS } from "../constants";
import { rootstockWalletClient } from "./config";

export const createUserTx = (metadata: string, account: `0x${string}`) =>
  rootstockWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "createUser",
    args: [metadata],
    account,
  });

export const triggerInvoiceClaimTx = (
  business: `0x${string}`,
  token: `0x${string}`,
  amount: bigint,
  metadata: string,
  account: `0x${string}`
) =>
  rootstockWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "triggerInvoiceClaim",
    args: [business, token, amount, metadata],
    account,
  });
