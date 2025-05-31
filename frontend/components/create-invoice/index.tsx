// create-invoice/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBusinesses, useInvoices, useProfile } from "@/hooks/use-api";
import {
  Loader2,
  FileSignature,
  Plus,
  Upload,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrivy } from "@privy-io/react-auth";
import { uploadInvoiceData } from "@/lib/upload";
import { Business } from "@/types";
import { TOKEN_ADDRESSES } from "@/lib/constants";

export default function CreateInvoice() {
  const router = useRouter();
  const { user } = usePrivy();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { claimInvoice, isLoading: creatingInvoice } = useInvoices();
  const [invoiceData, setInvoiceData] = useState<{
    title: string;
    description: string;
    amount_requested: string;
    currency: string;
    recipient: string;
    invoice: File | null;
  }>({
    title: "",
    description: "",
    amount_requested: "",
    currency: "cUSD",
    recipient: "",
    invoice: null,
  });

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setTimeout(() => {
      setUploadingFile(false);
      setInvoiceData((prev) => ({
        ...prev,
        invoice: file,
      }));
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (profile?.type != "user") return;
    setCreating(true);
    try {
      const { data, success, error } = await uploadInvoiceData({
        title: invoiceData.title,
        description: invoiceData.description,
        invoice: invoiceData.invoice,
      });

      if (!data || !success) {
        throw new Error(error || "Failed to upload invoice data");
      }

      await claimInvoice({
        title: invoiceData.title,
        description: invoiceData.description,
        requester: user?.wallet?.address as string,
        requestee: invoiceData.recipient,
        amount_requested: parseFloat(invoiceData.amount_requested),
        currency: invoiceData.currency,
        invoice: data.invoiceUrl,
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    (async function () {
      if (profile?.type == "user") {
        setLoadingBusinesses(true);
        const fetchedBusinesses = await getBusinesses();
        setBusinesses(fetchedBusinesses);
        setLoadingBusinesses(false);
      }
    })();
  }, [profile]);

  if (profileLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-900 gap-4">
        <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
        <p className="text-stone-500">Loading</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black pb-28">
      <div className="bg-stone-900 rounded-b-3xl px-6 py-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Create Invoice</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="px-6 pt-4 space-y-6">
        <Card className="bg-stone-900 border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-center">
              Invoice Details
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              {profile?.type == "user"
                ? "Request payment from a business"
                : "Create an invoice for a client"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200">
                Invoice Title
              </Label>
              <Input
                id="title"
                name="title"
                value={invoiceData.title}
                onChange={handleInputChange}
                placeholder="e.g., Website Development"
                className="bg-stone-800 border-stone-700 text-white focus-visible:ring-yellow-400 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={invoiceData.description}
                onChange={handleInputChange}
                placeholder="Describe the services or products provided"
                className="min-h-[100px] bg-stone-800 border-stone-700 text-white focus-visible:ring-yellow-400 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-gray-200">
                Payment Token
              </Label>
              <Select
                value={invoiceData.currency}
                onValueChange={(value: string) =>
                  handleSelectChange("currency", value)
                }
              >
                <SelectTrigger className="bg-stone-800 border-stone-700 text-white focus-visible:ring-yellow-400">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700 text-white">
                  {Object.entries(TOKEN_ADDRESSES[31]).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/${key.toLowerCase()}.png`}
                          alt={key}
                          width={24}
                          height={24}
                        />
                        <span>{key}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-gray-200">
                {profile?.type == "user"
                  ? "Business to Invoice"
                  : "Client to Invoice"}
              </Label>

              {profile?.type == "user" ? (
                <Select
                  value={invoiceData.recipient}
                  onValueChange={(value: string) =>
                    handleSelectChange("recipient", value)
                  }
                >
                  <SelectTrigger
                    disabled={!businesses || businesses.length === 0}
                    className="bg-stone-800 border-stone-700 text-white focus-visible:ring-yellow-400 data-[placeholder]:text-white disabled:text-gray-500"
                  >
                    <SelectValue
                      placeholder={
                        !businesses || businesses.length === 0
                          ? "No businesses found"
                          : "Select a business"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700 text-white">
                    {businesses.map((business) => (
                      <SelectItem
                        key={business.wallet_address}
                        value={business.wallet_address}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={business.image || "/placeholder-logo.png"}
                            alt={business.name || "Business Logo"}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{business.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="recipient"
                  name="recipient"
                  value={invoiceData.recipient}
                  onChange={handleInputChange}
                  placeholder="Enter wallet address"
                  className="bg-stone-800 border-stone-700 text-white focus-visible:ring-yellow-400"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Upload Invoice Document</Label>
              <div className="border-2 border-dashed border-stone-700 rounded-xl p-4 bg-stone-800/50">
                <div className="flex flex-col items-center justify-center">
                  {filePreview ? (
                    <div className="w-full">
                      <div className="relative aspect-[4/5] max-h-48 overflow-hidden rounded-xl mb-2">
                        <Image
                          src={filePreview}
                          alt="Invoice preview"
                          width={192}
                          height={240}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-300 truncate max-w-[200px]">
                          {invoiceData.invoice?.name || "Uploading..."}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setFilePreview(null);
                            setInvoiceData((prev) => ({
                              ...prev,
                              invoice: null,
                            }));
                          }}
                          className="text-gray-300 hover:text-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-300 mb-2">
                        Drag & drop or click to upload
                      </p>
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={uploadingFile}
                          className="bg-stone-700 border-stone-600 text-gray-200 hover:bg-stone-600 focus-visible:ring-yellow-400"
                        >
                          {uploadingFile ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          Select File
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-semibold focus-visible:ring-yellow-400"
              disabled={
                !invoiceData.title ||
                !invoiceData.amount_requested ||
                !invoiceData.recipient ||
                creatingInvoice ||
                !invoiceData.invoice ||
                creating
              }
              onClick={handleSubmit}
            >
              {creatingInvoice || creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Create Invoice
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
