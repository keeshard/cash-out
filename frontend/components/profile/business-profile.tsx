// profile/business-profile.tsx (create this new component)
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Mail, Globe, MapPin } from "lucide-react";
import { CreditManagement } from "@/components/credit-management";

interface BusinessProfileProps {
  profile: {
    data: {
      wallet_address: string;
      name: string | null;
      about: string | null;
      image: string | null;
      email: string | null;
      country: string | null;
      external_link: string | null;
      credit_amount: number | null;
      used_amount: number | null;
      invoice_prover_address: string | null;
    };
    invoices_received?: any[];
  };
}

export function BusinessProfile({ profile }: BusinessProfileProps) {
  const { data } = profile;
  const [creditAmount, setCreditAmount] = useState(data.credit_amount || 0);

  return (
    <div className="space-y-6">
      {/* Business Info Card */}
      <Card className="bg-stone-900 border-stone-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-yellow-400">
              {data.image ? (
                <AvatarImage src={data.image} alt={data.name || "Business"} />
              ) : (
                <AvatarFallback className="bg-yellow-400 text-stone-900">
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-white text-xl">
                {data.name || "Business Name"}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {data.wallet_address.slice(0, 6)}...
                {data.wallet_address.slice(-4)}
              </p>
            </div>
          </div>
        </CardHeader>

        {data.about && (
          <CardContent className="pt-0">
            <p className="text-gray-300 text-sm">{data.about}</p>
          </CardContent>
        )}
      </Card>

      {/* Contact Information */}
      <Card className="bg-stone-900 border-stone-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{data.email}</span>
            </div>
          )}

          {data.country && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{data.country}</span>
            </div>
          )}

          {data.external_link && (
            <div className="flex items-center space-x-3">
              <Globe className="h-4 w-4 text-gray-400" />
              <a
                href={data.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:text-blue-300 underline"
              >
                {data.external_link}
              </a>
            </div>
          )}

          {data.invoice_prover_address && (
            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs">Invoice Prover Address</p>
                <span className="text-gray-300 text-sm font-mono">
                  {data.invoice_prover_address.slice(0, 10)}...
                  {data.invoice_prover_address.slice(-8)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Management Section */}
      <Card className="bg-stone-900 border-stone-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            Credit Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreditManagement
            creditAmount={creditAmount}
            usedAmount={data.used_amount || 0}
            setCreditAmount={setCreditAmount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
