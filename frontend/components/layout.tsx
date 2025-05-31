"use client";
import { usePathname, useRouter } from "next/navigation";
import { User, Coins, PlusIcon, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-api";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import Onboarding from "./onboarding";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSwitchChain } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: profile,
    setData: setProfile,
    isLoading,
    clearData: clearProfile,
    refetch: refetchProfile,
  } = useProfile();
  const { logout, user, authenticated } = usePrivy();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [uiState, setUiState] = useState("initial");
  useEffect(() => {
    if (user?.wallet?.address && authenticated) {
      console.log("checking connected chain", chain);
      console.log(user.wallet.address);
      if (chain?.id !== 31) {
        switchChain({ chainId: 31 });
      }

      setUiState("checking");
      refetchProfile();
    }
  }, [user?.wallet?.address, authenticated]);
  return isLoading ? (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
      <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
      <p className="text-stone-500">Setting up the app...</p>
    </div>
  ) : profile ? (
    <div className="h-screen flex flex-col">
      {pathname !== "/testing/vlayer" && (
        <div className="w-full flex items-center justify-between px-4 py-3 bg-stone-900 border-0">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Rootstock Logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-lg tracking-tight text-white">
              Cash Out
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex space-x-1"
              onClick={async () => {
                clearProfile();
                setUiState("initial");
                logout();
              }}
            >
              <LogOut className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex-1 max-w-md border-none">
        {children}

        {pathname !== "/testing/vlayer" && (
          <div className="fixed bottom-0 left-0 right-0 bg-stone-900 shadow- px-6 py-3 flex justify-around">
            <button
              className={`flex flex-col items-center ${
                pathname === "/" ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => router.push("/")}
            >
              <Coins className="h-6 w-6" />
              <span className="text-xs mt-1">Invoices</span>
            </button>

            {profile?.type === "user" && (
              <button
                className={`flex flex-col items-center ${
                  pathname === "/create" ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => router.push("/create")}
              >
                <div className="bg-yellow-400 rounded-full p-3 -mt-8 shadow-lg">
                  <PlusIcon className="h-6 w-6 text-stone-900" />
                </div>
                <span className="text-xs mt-1 text-gray-400">Create</span>
              </button>
            )}

            <button
              className={`flex flex-col items-center ${
                pathname === "/profile" ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => router.push("/profile")}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="h-screen flex flex-col justify-end relative">
      <Image
        src="/bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <Onboarding
        profile={profile}
        profileLoading={isLoading}
        setProfile={setProfile}
        refetchProfile={refetchProfile}
        uiState={uiState}
        setUiState={setUiState}
      />
    </div>
  );
}
