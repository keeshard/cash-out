import { CheckCircle } from "lucide-react";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function GenerateProofComponent({
  isGeneratingProof,
  handleGenerateProof,
  selectedProofMethod,
}: {
  isGeneratingProof: boolean;
  handleGenerateProof: (method: string) => void;
  selectedProofMethod: string;
}) {
  return (
    <Button
      className="w-full bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-medium"
      onClick={() => handleGenerateProof(selectedProofMethod)}
      disabled={isGeneratingProof}
    >
      {isGeneratingProof ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating Proof...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Generate Proof
        </>
      )}
    </Button>
  );
}
