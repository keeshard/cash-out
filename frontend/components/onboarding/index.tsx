// onboarding/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { getVerificationById, useProfile } from "@/hooks/use-api";
import { usePrivy } from "@privy-io/react-auth";
import { SelfAppBuilder } from "@selfxyz/core";
import { countries } from "@selfxyz/qrcode";

import WelcomeScreen from "./welcome-screen";
import TypeSelection from "./type-selection";
import UserForm from "./user-form";
import BusinessForm from "./business-form";
import VerificationScreen from "./verification-screen";
import LoadingScreen from "./loading-screen";
import { VerifiedData } from "@/types";
import { useAccount, useSwitchChain } from "wagmi";
import { ProfileResponse } from "@/types/profile";

const disclosures = {
  issuing_state: false,
  name: true,
  nationality: true,
  date_of_birth: false,
  passport_number: false,
  gender: false,
  expiry_date: false,
  minimumAge: 18,
  excludedCountries: [
    countries.IRAN,
    countries.IRAQ,
    countries.NORTH_KOREA,
    countries.RUSSIA,
    countries.SYRIAN_ARAB_REPUBLIC,
    countries.VENEZUELA,
  ],
  ofac: true,
};

export default function Onboarding({
  profile,
  profileLoading,
  setProfile,
  refetchProfile,
  uiState,
  setUiState,
}: {
  profile: ProfileResponse | null;
  profileLoading: boolean;
  setProfile: (profile: ProfileResponse | null) => void;
  refetchProfile: () => void;
  uiState: string;
  setUiState: (uiState: string) => void;
}) {
  const [userId, setUserId] = useState<string | null>(null);

  const { user, authenticated, login } = usePrivy();
  const [backState, setBackState] = useState<string>("");

  const { verified, setVerified } = useStore((state: any) => state);
  const router = useRouter();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);

  useEffect(() => {
    if (!profileLoading && !profile && authenticated) {
      setUiState("type-selection");
    }
    if (!profileLoading && profile && authenticated) {
      router.push("/");
    }
  }, [profile, profileLoading, authenticated, router]);

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  useEffect(() => {
    (async function () {
      if (verified && userId) {
        const { data, success, error } = await getVerificationById(userId);
        console.log(data, success, error);
        if (success && data) {
          setVerifiedData(data);
        } else {
          setVerified(false);
        }
      }
    })();
  }, [verified, userId, setVerified]);

  if (!userId) return null;

  const selfApp = new SelfAppBuilder({
    appName: "Cash Out",
    scope: "cash-out",
    endpoint: "https://4810-195-113-187-136.ngrok-free.app/api/self-verify",
    endpointType: "https",
    devMode: true,
    userId: userId,
    disclosures: disclosures,
    userIdType: "uuid",
  }).build();

  const renderContent = () => {
    switch (uiState) {
      case "initial":
        return (
          <WelcomeScreen
            user={user}
            onLogin={() => {
              login();
            }}
          />
        );
      case "checking":
        return <LoadingScreen message="Checking your account..." />;
      case "type-selection":
        return <TypeSelection onSelectType={setUiState} />;
      case "user-form":
        return (
          <UserForm
            onBack={() => setUiState("type-selection")}
            showVerification={() => {
              setUiState("verification");
              setBackState("user-form");
            }}
            profile={profile}
            setProfile={setProfile}
            refetchProfile={refetchProfile}
            verifiedData={verifiedData}
          />
        );
      case "business-form":
        return (
          <BusinessForm
            onBack={() => setUiState("type-selection")}
            showVerification={() => {
              setUiState("verification");
              setBackState("business-form");
            }}
            profile={profile}
            setProfile={setProfile}
            refetchProfile={refetchProfile}
            verifiedData={verifiedData}
          />
        );
      case "verification":
        return (
          <VerificationScreen
            selfApp={selfApp}
            userId={userId}
            verified={verified}
            setVerified={setVerified}
            returnBack={() => {
              setUiState(backState);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[90%] min-h-[90vh] rounded-t-2xl shadow-xl bg-stone-900 pt-6 pb-8 px-6 relative mx-auto flex flex-col justify-center items-center">
      {renderContent()}
    </div>
  );
}
