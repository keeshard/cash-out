// onboarding/user-form.tsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, User, AtSign, Globe, Loader2, Flag } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createProfile, useProfile } from "@/hooks/use-api";
import { uploadUserProfile } from "@/lib/upload";
import { VerifiedData } from "@/types";
import ImageUpload from "./image-upload";
import Image from "next/image";
import { createUserTx } from "@/lib/tx/user";
import { rootstockTestnet } from "viem/chains";
import { toast } from "sonner";
import { ProfileResponse } from "@/types/profile";

interface UserFormProps {
  onBack: () => void;
  showVerification: () => void;
  profile: ProfileResponse | null;
  setProfile: (profile: ProfileResponse | null) => void;
  refetchProfile: () => void;
  verifiedData: VerifiedData | null;
}

export default function UserForm({
  onBack,
  showVerification,
  profile,
  setProfile,
  refetchProfile,
  verifiedData,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "gabrielantony56@gmail.com",
    country: "",
    external_link: "https://gabrielaxy.com",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [creatingProfile, setCreatingProfile] = useState(false);

  const { user } = usePrivy();
  const { wallets } = useWallets();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (verifiedData) {
      setFormData((prev) => ({
        ...prev,
        name: verifiedData.name,
        country: verifiedData.nationality,
      }));
    }
  }, [verifiedData]);

  useEffect(() => {
    if (user != null && user.email != undefined) {
      setFormData((prev) => ({
        ...prev,
        email: user?.email?.address || "",
      }));
    }
  }, [user]);

  const handleAvatarChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user?.wallet?.address) return;
    setCreatingProfile(true);

    try {
      const {
        success,
        data,
        error: uploadError,
      } = await uploadUserProfile({
        name: formData.name,
        image: image,
        country: formData.country,
        email: formData.email,
        external_link: formData.external_link,
      });

      if (!success || !data) {
        throw new Error(uploadError);
      }

      console.log("creating profile", data);

      const wallet = wallets[0];
      if (parseInt(wallet.chainId) != rootstockTestnet.id)
        await wallet.switchChain(rootstockTestnet.id);

      const tx = await createUserTx(
        data.metadataUrl,
        wallet.address as `0x${string}`
      );

      console.log("tx: ", tx);

      const { data: createdProfileData } = await createProfile({
        type: "user",
        wallet_address: user?.wallet?.address,
        name: formData.name,
        email: formData.email,
        country: formData.country,
        external_link: formData.external_link,
        image: data.pfpUrl,
      });

      setProfile(createdProfileData);

      toast("Transaction Successful", {
        description: "Created User Profile",
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
      console.error("Error creating user:", error);
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
        <h1 className="text-2xl font-bold text-white">Individual Profile</h1>
        <p className="text-gray-400 text-sm">Create your personal account</p>
      </div>

      <ScrollArea className="h-[65vh]">
        <ImageUpload
          preview={avatarPreview}
          onImageChange={handleAvatarChange}
          onRemove={() => {
            setAvatarPreview(null);
            setImage(null);
          }}
          placeholder={<User className="h-10 w-10 text-gray-400" />}
          description=""
        />

        <div className="px-2 space-y-4">
          {verifiedData ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                    placeholder="John Doe"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-300 text-sm">
                  Country
                </Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
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
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled={user?.email?.address != null}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_link" className="text-gray-300 text-sm">
              Website or Social Media
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="external_link"
                name="external_link"
                value={formData.external_link}
                onChange={handleInputChange}
                className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.country ||
              creatingProfile
            }
            className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/50 transition rounded-xl py-6 text-center text-stone-900 font-bold text-lg"
          >
            {creatingProfile ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating Profile...
              </>
            ) : (
              "Create User Profile"
            )}
          </Button>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
