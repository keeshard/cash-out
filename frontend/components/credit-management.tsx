"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CreditCard,
  Plus,
  Wallet,
  Link2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useLinkAccount, useWallets } from "@privy-io/react-auth";
import BinanceProofCard from "./proof-card/binance";
import BybitProofCard from "./proof-card/bybit";
import WalletProofComponent from "./proof-card/wallet";
import GenerateProofComponent from "./test-proof/generate";
import BinanceProofComponent from "./proof/binance";
import BybitProofComponent from "./proof/bybit";

interface CreditManagementProps {
  creditAmount: number;
  usedAmount: number;
  setCreditAmount: (amount: number) => void;
}

export function CreditManagement({
  creditAmount,
  usedAmount,
  setCreditAmount,
}: CreditManagementProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProofMethod, setSelectedProofMethod] = useState<string | null>(
    null
  );
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [connectedWallets, setConnectedWallets] = useState<string[]>([]);

  const { wallets } = useWallets();
  const { linkWallet } = useLinkAccount({
    onSuccess: ({ linkedAccount }) => {
      console.log("Wallet linked successfully");
      setIsConnecting(false);
      if (linkedAccount.type === "wallet") {
        setConnectedWallets((prev) => [...prev, linkedAccount.address]);
      }
    },
    onError: (error) => {
      console.error("Failed to link wallet:", error);
    },
  });
  const availableCredits = creditAmount - usedAmount;

  useEffect(() => {
    if (wallets) {
      setConnectedWallets(wallets.map((wallet) => wallet.address));
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    linkWallet();
  };

  // useEffect(() => {
  //   if (bybitResult && bybitCommitmentTxHash && bybitTxHash) {
  //     console.log("Bybit result:", bybitResult);
  //     console.log("Bybit commitment tx hash:", bybitCommitmentTxHash);
  //     console.log("Bybit tx hash:", bybitTxHash);

  //     (async function () {
  //       console.log("Upgrading credit amount");
  //       await fetch("/api/businesses/upgrade", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           wallet: user?.wallet?.address,
  //           amount: formatUnits(BigInt(bybitResult.toString()), 18),
  //         }),
  //       });
  //       console.log("Credit amount upgraded");
  //       setCreditAmount(
  //         creditAmount +
  //           parseFloat(formatUnits(BigInt(bybitResult.toString()), 18))
  //       );
  //     })();
  //   }
  // }, [bybitResult, bybitCommitmentTxHash, bybitTxHash]);

  useEffect(() => {}, []);

  return (
    <div className="space-y-4">
      {/* Credit Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-stone-900 border-stone-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400">Credit Limit</div>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-white text-lg font-bold">
              ${creditAmount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total approved</div>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400">Available</div>
              <div className="p-1 bg-green-500/10 rounded">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <div className="text-white text-lg font-bold">
              ${availableCredits.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Ready to use</div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Usage Progress */}
      <Card className="bg-stone-900 border-stone-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">Credit Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {creditAmount > 0 ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Used: ${usedAmount.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {((usedAmount / creditAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-stone-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(usedAmount / creditAmount) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-xs">N/A</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Increase Credit Limit Button */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Increase Credit Limit
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-stone-900 border-stone-700">
          <SheetHeader className="text-left">
            <SheetTitle className="text-white">Prove Your Funds</SheetTitle>
            <SheetDescription className="text-gray-400">
              Choose how you'd like to prove your available funds to increase
              your credit limit
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            {/* Binance Web App Proof */}
            <BinanceProofCard
              selectedProofMethod={selectedProofMethod || ""}
              setSelectedProofMethod={setSelectedProofMethod}
            />
            {/* Bybit Web App Proof */}
            <BybitProofCard
              selectedProofMethod={selectedProofMethod || ""}
              setSelectedProofMethod={setSelectedProofMethod}
            />

            {/* External Wallet Proof */}
            <WalletProofComponent
              selectedProofMethod={selectedProofMethod || ""}
              setSelectedProofMethod={setSelectedProofMethod}
            />

            {/* Show wallet options only if External Wallet is selected */}
            {selectedProofMethod === "external-wallet" && (
              <div className="space-y-3 ml-4 border-l-2 border-stone-700 pl-4">
                {connectedWallets.map((wallet, index) => (
                  <Card
                    key={index}
                    className={`bg-stone-800 border-stone-600 cursor-pointer transition-colors ${
                      selectedWallet === wallet
                        ? "border-yellow-400"
                        : "border-stone-600"
                    }`}
                    onClick={() =>
                      setSelectedWallet(
                        selectedWallet === wallet ? null : wallet
                      )
                    }
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Wallet className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">
                            External Wallet
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {wallet.slice(0, 6)}...{wallet.slice(-4)}
                          </p>
                        </div>
                        {selectedWallet === wallet && (
                          <CheckCircle className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Another Wallet - Only shown when external wallet option is selected */}
                {selectedWallet == null ? (
                  <Button
                    variant="outline"
                    className="w-full border-stone-600 text-gray-300 hover:text-white hover:border-yellow-400"
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Add Another Wallet
                      </>
                    )}
                  </Button>
                ) : (
                  <GenerateProofComponent
                    isGeneratingProof={isGeneratingProof}
                    handleGenerateProof={() => {}}
                    selectedProofMethod={selectedProofMethod || ""}
                  />
                )}
              </div>
            )}

            {/* Generate Proof Button */}
            {selectedProofMethod &&
              selectedProofMethod !== "external-wallet" &&
              (selectedProofMethod == "bybit" ? (
                <BybitProofComponent
                  creditAmount={creditAmount}
                  setCreditAmount={setCreditAmount}
                />
              ) : (
                <BinanceProofComponent
                  creditAmount={creditAmount}
                  setCreditAmount={setCreditAmount}
                />
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
