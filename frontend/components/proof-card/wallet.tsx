import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function WalletProofComponent({
  selectedProofMethod,
  setSelectedProofMethod,
}: {
  selectedProofMethod: string;
  setSelectedProofMethod: (method: string) => void;
}) {
  return (
    <Card
      className={`bg-stone-800 border-stone-600 cursor-pointer transition-colors hover:border-yellow-400 ${
        selectedProofMethod === "external-wallet" ? "border-yellow-400" : ""
      }`}
      onClick={() => setSelectedProofMethod("external-wallet")}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Image
            src="/privy.png"
            alt="Privy"
            width={35}
            height={35}
            className="rounded-full"
          />
          <div className="flex-1">
            <h3 className="text-white font-medium">External Wallet</h3>
            <p className="text-gray-400 text-sm">
              Generate ZK proof to prove your avg balance across EVM chains
            </p>
          </div>
          {selectedProofMethod === "external-wallet" && (
            <CheckCircle className="h-5 w-5 text-yellow-400" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
