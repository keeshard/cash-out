// components/proof/twitter-proof.tsx
"use client";

import { useEffect, useState } from "react";
import { useTwitterWebProof } from "@/hooks/vlayer/use-twitter-web-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";

export const TwitterProofComponent = () => {
  const { user } = usePrivy();
  const [disabled, setDisabled] = useState(false);

  const {
    requestWebProof,
    webProof,
    callProver,
    isPending,
    isCallProverIdle,
    result,
  } = useTwitterWebProof();

  useEffect(() => {
    if (
      webProof &&
      isCallProverIdle &&
      user &&
      user.wallet &&
      user.wallet.address
    ) {
      void callProver([webProof, user.wallet.address]);
    }
    `  `;
  }, [webProof, user, callProver, isCallProverIdle]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twitter Web Proof</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          disabled={disabled || isPending}
          onClick={() => {
            requestWebProof();
            setDisabled(true);
          }}
          className="w-full"
        >
          {isPending ? "Proving in progress..." : "Generate Twitter Proof"}
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
