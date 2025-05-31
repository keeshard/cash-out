import { CheckCheck } from "lucide-react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface WelcomeScreenProps {
  user: any;
  onLogin: () => void;
}

export default function WelcomeScreen({ user, onLogin }: WelcomeScreenProps) {
  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-4xl font-black mb-2 text-white">Cash Out</h1>
        <p className="text-gray-400 text-xs mb-8">
          unlocking instant liquidity for freelancers & SMEs using zkProofs
          powered by VLayer
        </p>
      </div>

      <div className="w-full flex justify-center mb-8">
        <Image
          src="/a.png"
          alt="Hero"
          width={200}
          height={200}
          className="rounded-xl"
        />
      </div>

      <div className="flex justify-center gap-3 items-center">
        <p className="text-center text-gray-300">Built on</p>
        <Image
          src="/rootstock.jpg"
          alt="Rootstock"
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>

      <div className="flex flex-1 justify-center items-center">
        <div className="flex gap-12">
          <div className="flex flex-col items-center">
            <CheckCheck className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-xs text-gray-300 text-center">Fast Payouts</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCheck className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-xs text-gray-300 text-center">
              Verified Invoices
            </p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCheck className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-xs text-gray-300 text-center">
              Reliable Clients
            </p>
          </div>
        </div>
      </div>

      {!user?.wallet?.address ? (
        <button
          onClick={onLogin}
          className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 transition rounded-xl py-3 text-center text-stone-900 font-bold text-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
          <p className="text-gray-300 text-sm mt-2">Checking account...</p>
        </div>
      )}
    </>
  );
}
