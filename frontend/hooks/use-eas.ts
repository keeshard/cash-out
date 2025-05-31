import { useState, useCallback, useMemo } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import {
  EAS,
  SchemaEncoder,
  NO_EXPIRATION,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EAS_CONTRACT_ADDRESS = "0xc300aeEadd60999933468738c9F5d7e9c0671e1C";
const CASH_OUT_INVOICE_SCHEMA_UID =
  "0x5706977c38c82f3e9ec661ad20c4fe692cc6a3cea8620ea3b5153583fe492307";
const ROOTSTOCK_TESTNET_CHAIN_ID = 31;

interface CreateAttestationParams {
  recipient: string;
  data: {
    requester_name: string;
    business_name: string;
    requester_email: string;
    business_email: string;
    amount: string;
    currency: string;
    proof_verification_tx_hash: string;
    proof_commitment_tx_hash: string;
    business_prover_address: string;
    invoice_identifier: string;
  };
  expirationTime?: bigint;
  revocable?: boolean;
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
  const { chain, address } = useAccount();

  const eas = useMemo(() => {
    const easInstance = new EAS(EAS_CONTRACT_ADDRESS);

    if (address) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
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
      revocable = false,
    }: CreateAttestationParams): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Verify network
        if (!chain || chain.id !== ROOTSTOCK_TESTNET_CHAIN_ID) {
          await switchChainAsync({
            chainId: ROOTSTOCK_TESTNET_CHAIN_ID,
          });
        }

        // Need signer for attestations
        if (address) {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          eas.connect(provider);
        }
        const schemaEncoder = new SchemaEncoder(
          "string requester_name, string business_name, string requester_email, string business_email, string amount, string currency, string proof_verification_tx_hash, string proof_commitment_tx_hash, string business_prover_address, string invoice_identifier"
        );
        const encodedData = schemaEncoder.encodeData(
          Object.entries(data).map(([key, value]) => ({
            name: key,
            value,
            type: "string",
          }))
        );

        const transaction = await eas.attest({
          schema: CASH_OUT_INVOICE_SCHEMA_UID,
          data: {
            recipient,
            expirationTime,
            revocable,
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
