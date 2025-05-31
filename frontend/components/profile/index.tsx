// profile/page.tsx (update your existing profile page)
"use client";
import React from "react";
import { useProfile } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Globe, MapPin, Loader2 } from "lucide-react";
import { BusinessProfile } from "./business-profile";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
        <p className="text-stone-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <p className="text-white">Profile not found</p>
      </div>
    );
  }

  // If it's a business profile, use the BusinessProfile component
  if (profile.type === "business") {
    return (
      <div className="flex flex-col min-h-screen bg-black pb-24">
        <div className="bg-stone-900 rounded-b-3xl px-6 py-6">
          <h1 className="text-xl font-bold text-white text-center">
            Business Profile
          </h1>
        </div>
        <div className="px-6 pt-4">
          <BusinessProfile profile={profile} />
        </div>
      </div>
    );
  }

  // User profile remains the same
  const { data } = profile;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <div className="bg-stone-900 rounded-b-3xl px-6 py-6">
        <h1 className="text-xl font-bold text-white text-center">Profile</h1>
      </div>

      <div className="px-6 pt-4 space-y-6">
        {/* User Info Card */}
        <Card className="bg-stone-900 border-stone-700">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-yellow-400">
                {data.image ? (
                  <AvatarImage src={data.image} alt={data.name || "User"} />
                ) : (
                  <AvatarFallback className="bg-yellow-400 text-stone-900">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-white text-xl">
                  {data.name || "User Name"}
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {data.wallet_address.slice(0, 6)}...
                  {data.wallet_address.slice(-4)}
                </p>
              </div>
            </div>
          </CardHeader>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
