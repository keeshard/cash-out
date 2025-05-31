// onboarding/business-form.tsx
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Building2,
  AtSign,
  Globe,
  FileText,
  Loader2,
  Flag,
  User,
  Wallet, // Add this import
} from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createProfile, useProfile } from "@/hooks/use-api";
import { uploadBusinessProfile } from "@/lib/upload";
import { VerifiedData } from "@/types";
import ImageUpload from "./image-upload";
import Image from "next/image";
import { toast } from "sonner";
import { createBusinessTx } from "@/lib/tx";
import { rootstockTestnet } from "viem/chains";
import { ProfileResponse } from "@/types/profile";

interface BusinessFormProps {
  onBack: () => void;
  showVerification: () => void;
  profile: ProfileResponse | null;
  setProfile: (profile: ProfileResponse | null) => void;
  refetchProfile: () => void;
  verifiedData: VerifiedData | null;
}
const verifiedData = {
  name: "John Doe",
  nationality: "US",
};
export default function BusinessForm({
  onBack,
  showVerification,
  profile,
  setProfile,
  refetchProfile,
}: // verifiedData,
BusinessFormProps) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    businessName: "",
    businessAbout: "",
    businessEmail: "",
    businessCountry: "US",
    businessExternalLink: "",
    invoiceProverAddress: "", // Add this field
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const { user } = usePrivy();
  const { wallets } = useWallets();

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (file: File) => {
    setLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // useEffect(() => {
  //   if (verifiedData) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       name: verifiedData.name,
  //       businessCountry: verifiedData.nationality,
  //     }));
  //   }
  // }, [verifiedData]);

  const handleSubmit = async () => {
    if (!user?.wallet?.address) return;
    setCreatingProfile(true);

    try {
      const {
        success,
        data,
        error: uploadError,
      } = await uploadBusinessProfile({
        name: formData.businessName,
        about: formData.businessAbout,
        email: formData.businessEmail,
        country: formData.businessCountry,
        external_link: formData.businessExternalLink,
        image: logo,
      });

      if (!success || !data) {
        throw new Error(uploadError);
      }

      const wallet = wallets[0];
      if (parseInt(wallet.chainId) != rootstockTestnet.id)
        await wallet.switchChain(rootstockTestnet.id);

      const tx = await createBusinessTx(
        data.metadataUrl,
        wallet.address as `0x${string}`
      );

      console.log("tx: ", tx);

      const { data: createdProfileData } = await createProfile({
        type: "business",
        wallet_address: user?.wallet?.address,
        owner: user?.wallet?.address,
        name: formData.businessName,
        about: formData.businessAbout,
        email: formData.businessEmail,
        country: formData.businessCountry,
        external_link: formData.businessExternalLink,
        image: data.logoUrl,
        threshold: 1,
        credit_amount: 0,
        used_amount: 0,
        invoice_prover_address: formData.invoiceProverAddress, // Add this
      });

      setProfile(createdProfileData);

      toast("Transaction Successful", {
        description: "Created Business Profile",
        action: {
          label: "View Tx",
          onClick: () => {
            window.open(
              `https://rootstock-testnet.blockscout.com/tx/${tx}`,
              "_blank"
            );
          },
        },
      });
    } catch (error) {
      console.error("Error creating business:", error);
    } finally {
      setCreatingProfile(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-4 p-0"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back
      </Button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Business Profile</h1>
        <p className="text-gray-400 text-sm">
          Create your organization account
        </p>
      </div>

      <ScrollArea className="h-[65vh]">
        <ImageUpload
          preview={logoPreview}
          onImageChange={handleLogoChange}
          onRemove={() => {
            setLogoPreview(null);
            setLogo(null);
          }}
          placeholder={<Building2 className="h-10 w-10 text-gray-400" />}
          description="Upload a business logo (recommended size: 200x200px)"
        />

        <div className="px-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-gray-300 text-sm">
              Business Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail" className="text-gray-300 text-sm">
              Business Email
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="businessEmail"
                name="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                placeholder="info@acme.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="invoiceProverAddress"
              className="text-gray-300 text-sm"
            >
              Invoice Prover Address
            </Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="invoiceProverAddress"
                name="invoiceProverAddress"
                value={formData.invoiceProverAddress}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                placeholder="0x..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAbout" className="text-gray-300 text-sm">
              About Business
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <Textarea
                id="businessAbout"
                name="businessAbout"
                value={formData.businessAbout}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-3 pl-10 text-white focus-visible:ring-yellow-400 min-h-[100px] placeholder:text-gray-400"
                placeholder="Tell us about your business"
              />
            </div>
          </div>

          {verifiedData ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 text-sm">
                  Verified Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                    placeholder="John Doe"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="businessCountry"
                  className="text-gray-300 text-sm"
                >
                  Country
                </Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="businessCountry"
                    name="businessCountry"
                    value={formData.businessCountry}
                    className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                    placeholder="United States"
                    disabled
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">
                Verify Passport with Self
              </Label>
              <div className="flex">
                <Button
                  variant="outline"
                  className="flex space-x-2 text-white border-stone-500 hover:text-stone-300"
                  onClick={showVerification}
                >
                  <Image
                    src="/self.jpg"
                    alt="Self"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p>Start Verification</p>
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="businessExternalLink"
              className="text-gray-300 text-sm"
            >
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="businessExternalLink"
                name="businessExternalLink"
                value={formData.businessExternalLink}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                placeholder="https://acme.com"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              !formData.businessName ||
              !formData.businessEmail ||
              !formData.businessCountry ||
              !formData.invoiceProverAddress ||
              creatingProfile
            }
            className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/50 transition rounded-xl py-6 text-center text-stone-900 font-bold text-lg"
          >
            {creatingProfile ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating Business...
              </>
            ) : (
              "Create Business Profile"
            )}
          </Button>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
