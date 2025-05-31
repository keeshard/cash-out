import { CASH_OUT_ABI, CASH_OUT_ADDRESS } from "../constants";
import { rootstockWalletClient } from "./config";
import { erc20Abi } from "viem";

export const createBusinessTx = (metadata: string, account: `0x${string}`) =>
  rootstockWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "createBusiness",
    args: [metadata],
    account,
  });

export const approveTokenTx = (
  token: `0x${string}`,
  amount: bigint,
  business: `0x${string}`
) =>
  rootstockWalletClient.writeContract({
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [CASH_OUT_ADDRESS, amount],
    account: business,
  });

export const settleInvoiceTx = (invoiceId: bigint, business: `0x${string}`) =>
  rootstockWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "settleInvoice",
    args: [invoiceId],
    account: business,
  });
