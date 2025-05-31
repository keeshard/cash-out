import React from "react";
import { CheckCheck, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import SelfQRcodeWrapper from "@selfxyz/qrcode";
import { Button } from "@/components/ui/button";

interface VerificationScreenProps {
  selfApp: any;
  userId: string;
  verified: boolean;
  setVerified: (verified: boolean) => void;
  returnBack: () => void;
}

export default function VerificationScreen({
  selfApp,
  userId,
  verified,
  setVerified,
  returnBack,
}: VerificationScreenProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mt-4 text-center">
        <Image
          src="/self.jpg"
          width={60}
          height={60}
          className="rounded-full mx-auto mb-3"
          alt="Self"
        />
        <h1 className="text-2xl font-black mb-2 text-white">
          Verify Your Identity
        </h1>
        <p className="text-gray-400 text-xs mb-8">
          Scan this QR code with the Self app to verify your identity
        </p>

        {!verified ? (
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              console.log("Verification successful!");
              setVerified(true);
              returnBack();
            }}
            size={200}
          />
        ) : (
          <>
            <div className="bg-green-900/20 p-4 rounded-full mx-auto mb-4">
              <CheckCheck className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-sm text-gray-300 mb-8">
              Verification Successful!
            </p>
            <div className="flex w-full justify-center items-center space-x-2">
              <Loader2 className="animate-spin h-5 w-5 text-yellow-400" />
              <p className="text-gray-300 text-sm">Redirecting back</p>
            </div>
          </>
        )}

        {!verified && (
          <>
            <p className="mt-6 text-sm text-gray-500">
              User ID: {userId.substring(0, 8)}...
              {userId.substring(userId.length - 8)}
            </p>
            <Button
              variant="ghost"
              className="hover:bg-transparent text-yellow-400 mt-4 hover:text-yellow-500"
              onClick={() => {
                returnBack();
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <p>Back</p>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
