import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function BybitProofCard({
  selectedProofMethod,
  setSelectedProofMethod,
}: {
  selectedProofMethod: string;
  setSelectedProofMethod: (method: string) => void;
}) {
  return (
    <Card
      className={`bg-stone-800 border-stone-600 cursor-pointer transition-colors hover:border-yellow-400 ${
        selectedProofMethod === "bybit" ? "border-yellow-400" : ""
      }`}
      onClick={() => setSelectedProofMethod("bybit")}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Image
            src="/bybit.jpg"
            alt="Bybit"
            width={35}
            height={35}
            className="rounded-full"
          />
          <div className="flex-1">
            <h3 className="text-white font-medium">Bybit Web App</h3>
            <p className="text-gray-400 text-sm">
              Generate ZK proof from to prove your assets value on Bybit
            </p>
          </div>
          {selectedProofMethod === "bybit" && (
            <CheckCircle className="h-5 w-5 text-yellow-400" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
