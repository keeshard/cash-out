// dashboard/quick-stats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Clock } from "lucide-react";

interface QuickStatsCardsProps {
  profile: {
    type: "user" | "business";
    data: any;
    invoices_requested?: any[];
    invoices_received?: any[];
  };
  userAddress: string;
}

// Helper function to calculate total amount with token conversion
const calculateTotalAmount = (invoices: any[]) => {
  return invoices.reduce((total, invoice) => {
    const amount = invoice.amount_requested || 0;
    // If token is RIF, multiply by 18, otherwise just add
    if (invoice.currency === "RIF") {
      return total + amount * 18;
    }
    return total + amount;
  }, 0);
};

export function QuickStatsCards({
  profile,
  userAddress,
}: QuickStatsCardsProps) {
  const isUser = profile.type === "user";
  const invoices = isUser
    ? profile.invoices_requested || []
    : profile.invoices_received || [];

  const getStatsData = () => {
    if (isUser) {
      const claimedInvoices = invoices.filter(
        (inv: any) => inv.status === "claimed"
      );
      return {
        firstStat: claimedInvoices.length,
        secondStat: calculateTotalAmount(claimedInvoices),
        firstLabel: "Total Invoices",
        secondLabel: "Total Amount Claimed",
        firstDesc: "Count of invoices",
        secondDesc: "Your net USD revenue",
      };
    } else {
      const claimedInvoices = invoices.filter(
        (inv: any) => inv.status === "claimed"
      );
      return {
        firstStat: invoices.length,
        secondStat: calculateTotalAmount(claimedInvoices),
        firstLabel: "Total Invoices",
        secondLabel: "Total Amount Paid",
        firstDesc: "Count of invoices",
        secondDesc: "Your net USD spent",
      };
    }
  };

  const {
    firstStat,
    secondStat,
    firstLabel,
    secondLabel,
    firstDesc,
    secondDesc,
  } = getStatsData();

  return (
    <div className="flex justify-center items-stretch space-x-4 overflow-x-auto pb-2 -mb-12">
      <Card className="min-w-[160px] bg-black/20 border-stone-700 shadow-xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-gray-400">{firstLabel}</div>
            <div className="p-1.5 bg-yellow-400/10 rounded-xl">
              <Coins className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <div className="text-white text-xl font-bold mb-1">{firstStat}</div>
          <div className="text-xs text-gray-400">{firstDesc}</div>
        </CardContent>
      </Card>

      <Card className="min-w-[160px] bg-black/20 border-stone-700 shadow-xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-gray-400">{secondLabel}</div>
            <div className="p-1.5 bg-blue-400/10 rounded-xl">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-white text-xl font-bold mb-1">
            ${secondStat.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">{secondDesc}</div>
        </CardContent>
      </Card>
    </div>
  );
}
