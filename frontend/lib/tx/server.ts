import { CASH_OUT_ABI, CASH_OUT_ADDRESS } from "../constants";
import { rootstockServerWalletClient } from "./config";

export const completeInvoiceClaimTx = (
  invoiceId: bigint,
  amount: bigint,
  receiver: `0x${string}`
) =>
  rootstockServerWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "completeInvoiceClaim",
    args: [receiver, invoiceId, amount],
  });

export const upgradeLimitTx = (business: `0x${string}`, amount: bigint) =>
  rootstockServerWalletClient.writeContract({
    address: CASH_OUT_ADDRESS,
    abi: CASH_OUT_ABI,
    functionName: "upgradeLimit",
    args: [business, amount],
  });
