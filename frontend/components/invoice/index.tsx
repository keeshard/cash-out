// invoice/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInvoices, useProfile } from "@/hooks/use-api";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  User,
  Building2,
  Calendar,
  BanknoteIcon,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { usePrivy } from "@privy-io/react-auth";

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

async function fetchInvoice(id: string): Promise<Invoice | null> {
  try {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default function InvoiceDetailComponent({ id }: { id: string }) {
  const router = useRouter();
  const { user } = usePrivy();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { settleInvoice, isLoading: updating } = useInvoices();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [showSettleDialog, setShowSettleDialog] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      const invoiceData = await fetchInvoice(id);
      setInvoice(invoiceData);
      setInvoiceLoading(false);
    };
    loadInvoice();
  }, [id]);

  const isRequester = invoice?.requester === user?.wallet?.address;
  const isRequestee = invoice?.requestee === user?.wallet?.address;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSettle = async () => {
    if (!invoice) return;
    try {
      await settleInvoice(invoice.id);
      setShowSettleDialog(false);
      // Reload invoice data
      const updatedInvoice = await fetchInvoice(id);
      setInvoice(updatedInvoice);
    } catch (error) {
      console.error("Error settling invoice:", error);
    }
  };

  if (invoiceLoading || profileLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
        <p className="text-gray-300">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <XCircle className="h-12 w-12 text-red-400" />
        <p className="text-white font-medium text-lg">Invoice not found</p>
        <Button
          variant="outline"
          className="mt-4 border-gray-700 text-gray-300 hover:text-white"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-900 pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-white">Invoice Details</h1>
        <div className="w-9"></div>
      </div>

      {/* Invoice Card */}
      <div className="px-6 space-y-6">
        <Card className="bg-black/20 border-none shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-white">
                  {invoice.title || "Untitled Invoice"}
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Invoice #{invoice.id}
                </p>
              </div>
              <div
                className={`inline-flex items-center rounded-xl border-[1px] px-2.5 py-0.5 text-xs font-semibold ${
                  invoice.status === "claimed"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                <BanknoteIcon className="h-3 w-3 mr-1" />
                {invoice.status}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Invoice Parties */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 bg-stone-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">From</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border border-stone-700">
                    <AvatarImage src={invoice.requester_user?.image || ""} />
                    <AvatarFallback className="bg-stone-700 text-gray-300">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {invoice.requester_user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {invoice.requester?.substring(0, 6)}...
                      {invoice.requester?.substring(
                        invoice.requester.length - 4
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-stone-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">To</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border border-stone-700">
                    <AvatarImage
                      src={invoice.requestee_business?.image || ""}
                    />
                    <AvatarFallback className="bg-stone-700 text-gray-300">
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {invoice.requestee_business?.name || "Unknown Business"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {invoice.requestee?.substring(0, 6)}...
                      {invoice.requestee?.substring(
                        invoice.requestee.length - 4
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-stone-700" />

            {/* Invoice Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="text-lg font-bold text-white">
                    {invoice.amount_requested} {invoice.currency}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Date Created</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-300">
                      {formatDate(invoice.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {invoice.description && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-300 bg-stone-800/50 rounded-xl p-3">
                    {invoice.description}
                  </p>
                </div>
              )}

              {invoice.invoice && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Attached Document
                  </p>
                  <div className="bg-stone-800/50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <a
                        href={invoice.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-400 text-sm truncate max-w-[200px]"
                      >
                        View Document
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-400 hover:text-yellow-500"
                      onClick={() => window.open(invoice.invoice!, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2 flex flex-col space-y-3">
            {/* Action buttons based on user role and invoice status */}
            {invoice.status === "claimed" && isRequestee && (
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                onClick={() => setShowSettleDialog(true)}
              >
                <BanknoteIcon className="h-4 w-4 mr-2" />
                Settle Invoice
              </Button>
            )}

            {invoice.status === "settled" && (
              <div className="bg-stone-800/50 rounded-xl p-3 text-center">
                <p className="text-sm text-gray-300">
                  <BanknoteIcon className="h-4 w-4 inline-block mr-2 text-green-400" />
                  This invoice has been settled
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Settle Dialog */}
      <Dialog open={showSettleDialog} onOpenChange={setShowSettleDialog}>
        <DialogContent className="bg-stone-800 border-stone-700 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settle Invoice</DialogTitle>
            <DialogDescription className="text-gray-400">
              Settle the funds for this claimed invoice.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                Invoice Amount:{" "}
                <span className="font-medium text-white">
                  {invoice.amount_requested} {invoice.currency}
                </span>
              </p>
              <p className="text-sm text-gray-300">
                Requester:{" "}
                <span className="font-medium text-white">
                  {invoice.requester_user?.name || "Unknown User"}
                </span>
              </p>
            </div>

            <div className="bg-yellow-500/10 rounded-xl p-3">
              <p className="text-sm text-yellow-300 flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                This action will mark the invoice as settled and complete the
                payment process.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSettleDialog(false)}
              className="text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSettle}
              disabled={updating}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Settle Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
