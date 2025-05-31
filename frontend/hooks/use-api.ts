import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { CreateProfileRequest, VerifiedData } from "@/types";
import { ProfileApiResponse, ProfileResponse } from "@/types/profile";

interface ApiResponse<T> {
  data: T | null;
  setData: (data: T | null) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface ApiResponseWithFetch<T> extends ApiResponse<T> {
  fetchByAddress: (address: string) => Promise<any>;
  clearData: () => void;
}

export function useProfile(): ApiResponseWithFetch<ProfileResponse> {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, authenticated } = usePrivy();
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!authenticated || !user || !user.wallet) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile/${user.wallet.address}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const result: ProfileApiResponse = await response.json();
      if (
        ("type" in result && result.type === "unregistered") ||
        "error" in result
      ) {
        setData(null);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchByAddress(address: string) {
    const response = await fetch(`/api/profile/${address}`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    const result = await response.json();
    return result;
  }

  const clearData = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [authenticated, user]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProfile,
    setData,
    fetchByAddress,
    clearData,
  };
}

export function useInvoices() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const claimInvoice = async (invoiceData: {
    title?: string;
    description?: string;
    requester: string;
    requestee: string;
    invoice?: string;
    amount_requested: number;
    currency: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/invoices/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to claim invoice");
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const settleInvoice = async (invoice_id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/invoices/settle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to settle invoice");
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimInvoice,
    settleInvoice,
    isLoading,
    error,
    success,
  };
}

export async function createProfile(inputData: CreateProfileRequest) {
  const response = await fetch("/api/profile/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create profile");
  }

  return await response.json();
}

export async function getBusinesses() {
  const response = await fetch("/api/businesses");
  if (!response.ok) throw new Error("Failed to fetch businesses");
  const result = await response.json();
  return result;
}

export async function getVerificationById(userSessionId: string): Promise<{
  success: boolean;
  data?: VerifiedData;
  error?: string;
}> {
  const response = await fetch(`/api/verifications/${userSessionId}`);
  if (!response.ok) throw new Error("Failed to fetch verification");
  const result = await response.json();
  return result;
}
