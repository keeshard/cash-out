// components/proof/invoice-proof.tsx
"use client";

import { useState } from "react";
import { useEmailProofVerification } from "@/hooks/vlayer/use-invoice-email-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

enum ProofVerificationStep {
  READY = "Ready",
  SENDING_TO_PROVER = "Sending to prover...",
  WAITING_FOR_PROOF = "Waiting for proof...",
  VERIFYING_ON_CHAIN = "Verifying on-chain...",
  DONE = "Done!",
}

export const InvoiceProofComponent = () => {
  const [emailContent, setEmailContent] = useState<string>("");
  const [proverAddress, setProverAddress] = useState<string>("");

  const { startProving, proof, currentStep } = useEmailProofVerification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        let content = event.target?.result as string;

        // Fix line endings first
        content = content.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");

        // Fix DKIM signature indentation (tabs to spaces)
        content = content.replace(/\t/g, " ");

        // Ensure there's a blank line between headers and body
        const lines = content.split("\r\n");
        let headerEndIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === "") {
            headerEndIndex = i;
            break;
          }
        }

        // If no blank line found, insert one after last header
        if (headerEndIndex === -1) {
          for (let i = lines.length - 1; i >= 0; i--) {
            if (
              lines[i].startsWith(" ") ||
              lines[i].startsWith("\t") ||
              lines[i].includes(":")
            ) {
              lines.splice(i + 1, 0, "");
              break;
            }
          }
          content = lines.join("\r\n");
        }
        console.log("email content");
        console.log(content);
        setEmailContent(content);
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
          disabled={
            (currentStep != ProofVerificationStep.READY &&
              currentStep != ProofVerificationStep.DONE) ||
            !emailContent ||
            !proverAddress
          }
          onClick={() => {
            startProving(emailContent, proverAddress);
          }}
          className="w-full"
        >
          {currentStep == ProofVerificationStep.READY
            ? "Generate Invoice Proof"
            : currentStep === ProofVerificationStep.SENDING_TO_PROVER
            ? "Proving in progress..."
            : currentStep === ProofVerificationStep.WAITING_FOR_PROOF
            ? "Waiting for proof..."
            : currentStep === ProofVerificationStep.VERIFYING_ON_CHAIN
            ? "Verifying on-chain..."
            : "Done!"}
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
