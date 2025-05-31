import React from "react";

interface InvoiceCardProps {
  invoice: {
    client: string;
    amount: number;
    status: string;
  };
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => (
  <div className="rounded-xl border bg-card text-card-foreground p-4 flex flex-col gap-1 shadow-sm">
    <div className="font-bold text-base">{invoice.client}</div>
    <div className="text-sm text-muted-foreground">{invoice.amount} cUSD</div>
    <div className="text-xs font-semibold text-primary">{invoice.status}</div>
  </div>
);
