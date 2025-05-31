// components/proof/balance-proof.tsx
"use client";

import { useEffect, useState } from "react";
import { useBalanceTimeTravelProof } from "@/hooks/vlayer/use-balance-time-travel-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { getTokensToProve } from "@/lib/vlayer";

export const BalanceProofComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const { callProver, result } = useBalanceTimeTravelProof();

  useEffect(() => {
    if (result) {
      setIsLoading(false);
    }
  }, [result]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Time Travel Proof</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            // const tokens = getTokensToProve({
            //   84532: 23833365,
            //   11155420: 25816114,
            // });
            console.log([
              "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
              84532,
              26284121,
              address,
            ]);
            callProver([
              "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
              84532,
              26284121,
              address,
            ]);
          }}
          className="w-full"
        >
          {isLoading ? "Proving in progress..." : "Generate Balance Proof"}
        </Button>

        {result != null && (
          <div className="text-sm text-green-600">
            <p>✓ Proof generated successfully</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
