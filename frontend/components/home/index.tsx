// dashboard/index.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-api";
import { Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { HomeHeader } from "./header";
import { InvoiceTabs } from "./invoice-tabs";

export default function Dashboard() {
  const router = useRouter();
  const { user } = usePrivy();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (profileLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
        <p className="text-stone-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile || !profile.data) {
    router.push("/onboarding");
    return null;
  }

  const handleInvoiceClick = (invoiceId: string) => {
    router.push(`/invoice/${invoiceId}`);
  };

  const handleCreateInvoice = () => {
    router.push("/create");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <HomeHeader profile={profile} />

      <div className="px-6 pt-4 pb-24 flex-1">
        <InvoiceTabs
          profile={profile}
          userAddress={user?.wallet?.address || ""}
          onInvoiceClick={handleInvoiceClick}
          onCreateInvoice={handleCreateInvoice}
        />
      </div>
    </div>
  );
}
