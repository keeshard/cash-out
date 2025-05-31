// dashboard/invoice-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, FileSignature, BanknoteIcon } from "lucide-react";

interface Invoice {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
  requester: string | null;
  requestee: string | null;
  invoice: string | null;
  amount_requested: number | null;
  currency: string | null;
  status: "claimed" | "settled";
  requester_user?: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
  requestee_business?: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface InvoiceCardProps {
  invoice: Invoice;
  userType: "user" | "business";
  tabType: "first" | "second";
  onClick: () => void;
}

export function InvoiceCard({
  invoice,
  userType,
  tabType,
  onClick,
}: InvoiceCardProps) {
  const getEntityName = () => {
    if (userType === "user") {
      return `To: ${invoice.requestee_business?.name || "Unknown Business"}`;
    } else {
      return `From: ${invoice.requester_user?.name || "Unknown User"}`;
    }
  };

  return (
    <Card
      className="bg-stone-900 hover:bg-stone-800 border-none transition cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-200">
              {invoice.title || "Untitled Invoice"}
            </h3>
            <div className="text-xs text-gray-400 mt-1">{getEntityName()}</div>
          </div>

          <div
            className={`inline-flex items-center rounded-xl border-[1px] px-2.5 py-0.5 text-xs font-semibold ${
              invoice.status === "claimed"
                ? "bg-yellow-500/20 text-yellow-300 border-none"
                : "bg-blue-500/20 text-blue-300 border-none"
            }`}
          >
            {invoice.status}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-gray-400">Amount</div>
            <div className="text-lg font-bold text-gray-200">
              {invoice.amount_requested} {invoice.currency}
            </div>
          </div>

          <div className="flex items-center text-yellow-400 text-sm font-medium">
            <BanknoteIcon className="h-4 w-4 mr-1" />
            <span>{invoice.status === "claimed" ? "Settle" : "View"}</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
