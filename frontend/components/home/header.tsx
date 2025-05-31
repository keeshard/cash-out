// dashboard/header.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Building2 } from "lucide-react";
import { QuickStatsCards } from "./quick-stats";
import { usePrivy } from "@privy-io/react-auth";

interface HomeHeaderProps {
  profile: {
    type: "user" | "business";
    data: any;
    invoices_requested?: any[];
    invoices_received?: any[];
  };
}

export function HomeHeader({ profile }: HomeHeaderProps) {
  const { user } = usePrivy();
  const isUser = profile.type === "user";
  const name = profile.type === "user" ? profile.data.name : profile.data.name;
  const image = profile.data.image;

  return (
    <div className="relative bg-stone-900 rounded-b-3xl px-6 pt-6 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 border-2 border-yellow-400">
            {image ? (
              <AvatarImage src={image} alt={name || "User"} />
            ) : (
              <AvatarFallback className="bg-yellow-400 text-stone-900">
                {isUser ? (
                  <User className="h-6 w-6" />
                ) : (
                  <Building2 className="h-6 w-6" />
                )}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="ml-3">
            <div className="text-gray-400 text-xs">Welcome back,</div>
            <h1 className="text-white font-bold text-xl">{name || "User"}</h1>
          </div>
        </div>

        <div
          className={`inline-flex items-center rounded-xl border-[1px] px-2.5 py-0.5 text-xs font-semibold ${
            isUser
              ? "bg-blue-500/20 text-blue-300"
              : "bg-purple-500/20 text-purple-300"
          }`}
        >
          {isUser ? "Individual" : "Business"}
        </div>
      </div>
      <QuickStatsCards
        profile={profile}
        userAddress={user?.wallet?.address || ""}
      />
    </div>
  );
}
