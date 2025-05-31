// dashboard/invoice-tabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileSignature, BanknoteIcon } from "lucide-react";
import { InvoiceCard } from "./invoice-card";
import { EmptyState } from "./empty-state";

interface InvoiceTabsProps {
  profile: {
    type: "user" | "business";
    data: any;
    invoices_requested?: any[];
    invoices_received?: any[];
  };
  userAddress: string;
  onInvoiceClick: (invoiceId: string) => void;
  onCreateInvoice: () => void;
}

export function InvoiceTabs({
  profile,
  userAddress,
  onInvoiceClick,
  onCreateInvoice,
}: InvoiceTabsProps) {
  const isUser = profile.type === "user";
  const invoices = isUser
    ? profile.invoices_requested || []
    : profile.invoices_received || [];

  const getFilteredInvoices = (tabKey: string) => {
    if (tabKey === "tab1") {
      return invoices.filter((inv: any) => inv.status === "claimed");
    } else {
      return invoices.filter((inv: any) => inv.status === "settled");
    }
  };

  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-stone-900 rounded-xl h-11">
        <TabsTrigger
          value="tab1"
          className="text-gray-400 data-[state=active]:bg-black/20 data-[state=active]:text-white data-[state=active]:shadow rounded-xl py-2"
        >
          Claimed
        </TabsTrigger>
        <TabsTrigger
          value="tab2"
          className="text-gray-400 data-[state=active]:bg-black/20 data-[state=active]:text-white data-[state=active]:shadow rounded-xl py-2"
        >
          Settled
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab1" className="space-y-4 mt-2">
        {getFilteredInvoices("tab1").length > 0 ? (
          getFilteredInvoices("tab1").map((invoice: any) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              userType={isUser ? "user" : "business"}
              tabType="first"
              onClick={() => onInvoiceClick(invoice.id)}
            />
          ))
        ) : (
          <EmptyState
            title="No claimed invoices"
            description="No invoices have been claimed yet."
            icon={<FileSignature className="h-8 w-8 text-yellow-400" />}
            buttonText="Create Invoice"
            onClick={onCreateInvoice}
            showButton={isUser}
          />
        )}
      </TabsContent>

      <TabsContent value="tab2" className="space-y-4 mt-2">
        {getFilteredInvoices("tab2").length > 0 ? (
          getFilteredInvoices("tab2").map((invoice: any) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              userType={isUser ? "user" : "business"}
              tabType="second"
              onClick={() => onInvoiceClick(invoice.id)}
            />
          ))
        ) : (
          <EmptyState
            title="No settled invoices"
            description="No invoices have been settled yet."
            icon={<BanknoteIcon className="h-8 w-8 text-yellow-400" />}
            buttonText="Create Invoice"
            onClick={onCreateInvoice}
            showButton={isUser}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
