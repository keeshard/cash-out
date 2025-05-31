"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TwitterProofComponent } from "@/components/test-proof/twitter-proof";
import { BybitProofComponent } from "@/components/test-proof/bybit-proof";
import { InvoiceProofComponent } from "@/components/test-proof/invoice-proof";
import { BalanceProofComponent } from "@/components/test-proof/balance-proof";
import { BinanceProofComponent } from "@/components/test-proof/binance-proof";

type ProofType = "twitter" | "bybit" | "binance" | "invoice" | "balance" | null;

export default function VlayerTestingPage() {
  const [selectedProof, setSelectedProof] = useState<ProofType>(null);

  const proofOptions: {
    id: ProofType;
    title: string;
    description: string;
    component: any;
  }[] = [
    {
      id: "twitter" as const,
      title: "Twitter Web Proof",
      description: "Prove Twitter account ownership",
      component: <TwitterProofComponent />,
    },
    {
      id: "bybit" as const,
      title: "Bybit Web Proof",
      description: "Generate Bybit proof",
      component: <BybitProofComponent />,
    },
    {
      id: "binance" as const,
      title: "Binance Web Proof",
      description: "Generate Binance proof",
      component: <BinanceProofComponent />,
    },
    {
      id: "invoice" as const,
      title: "Invoice Email Proof",
      description: "Prove email invoice",
      component: <InvoiceProofComponent />,
    },
    {
      id: "balance" as const,
      title: "Balance Time Travel Proof",
      description: "Historical balance verification",
      component: <BalanceProofComponent />,
    },
  ];

  if (selectedProof) {
    const currentProof = proofOptions.find((p) => p.id === selectedProof);
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedProof(null)}
            className="mb-4"
          >
            ← Back
          </Button>
          {currentProof?.component}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">VLayer Proofs</h1>
        {proofOptions.map((option) => (
          <Card
            key={option.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProof(option.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
