import { useState, useCallback, useMemo } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import {
  EAS,
  SchemaEncoder,
  NO_EXPIRATION,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EAS_CONTRACT_ADDRESS = "0xc300aeEadd60999933468738c9F5d7e9c0671e1C";
const CASH_OUT_INVOICE_SCHEMA_UID = "";
const ROOTSTOCK_TESTNET_CHAIN_ID = 31;

interface CreateAttestationParams {
  recipient: string;
  data: Array<{ name: string; value: any; type: string }>;
  expirationTime?: bigint;
  revocable?: boolean;
  refUID?: string;
  value?: string;
}

interface UseEasReturn {
  getAttestation: (uid: string) => Promise<any>;
  createAttestation: (params: CreateAttestationParams) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useEas(): UseEasReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { switchChainAsync } = useSwitchChain();
  const { chain } = useAccount();

  const eas = useMemo(() => {
    const easInstance = new EAS(EAS_CONTRACT_ADDRESS);

    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      easInstance.connect(provider);
    }

    return easInstance;
  }, []);

  const getAttestation = useCallback(
    async (uid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const attestation = await eas.getAttestation(uid);
        return attestation;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to get attestation";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [eas]
  );

  const createAttestation = useCallback(
    async ({
      recipient,
      data,
      expirationTime = NO_EXPIRATION,
      revocable = true,
      refUID = "0x0000000000000000000000000000000000000000000000000000000000000000",
      value = "0",
    }: CreateAttestationParams): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Verify network
        if (!chain || chain.id !== ROOTSTOCK_TESTNET_CHAIN_ID) {
          throw new Error("Please switch to Rootstock Testnet");
        }

        // Need signer for attestations
        if (typeof window === "undefined" || !window.ethereum) {
          throw new Error("Web3 provider not found");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        eas.connect(signer);

        // Build schema string from data array
        const schemaString = data
          .map((item) => `${item.type} ${item.name}`)
          .join(", ");
        const schemaEncoder = new SchemaEncoder(schemaString);
        const encodedData = schemaEncoder.encodeData(data);

        const transaction = await eas.attest({
          schema: CASH_OUT_INVOICE_SCHEMA_UID,
          data: {
            recipient,
            expirationTime,
            revocable,
            refUID,
            data: encodedData,
          },
        });

        const newAttestationUID = await transaction.wait();
        return newAttestationUID;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to create attestation";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [eas, chain]
  );

  return {
    getAttestation,
    createAttestation,
    isLoading,
    error,
  };
}
