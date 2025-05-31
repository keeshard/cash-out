// components/proof/invoice-proof.tsx
"use client";

import { useEffect, useState } from "react";
import { useEmailProofVerification } from "@/hooks/vlayer/use-invoice-email-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { Input } from "@/components/ui/input";

export const InvoiceProofComponent = () => {
  const [isPending, setIsPending] = useState(false);
  const [emailContent, setEmailContent] = useState<string>("");
  const [proverAddress, setProverAddress] = useState<string>("");

  const { startProving, proof } = useEmailProofVerification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmailContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Email Proof</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="file"
            accept=".eml"
            onChange={handleFileChange}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Prover Address"
            value={proverAddress}
            onChange={(e) => setProverAddress(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          disabled={isPending || !emailContent || !proverAddress}
          onClick={() => {
            setIsPending(true);
            startProving(emailContent, proverAddress);
          }}
          className="w-full"
        >
          {isPending ? "Proving in progress..." : "Generate Invoice Proof"}
        </Button>

        {proof != null && (
          <div className="text-sm text-green-600">
            <p>✓ Proof generated successfully</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
