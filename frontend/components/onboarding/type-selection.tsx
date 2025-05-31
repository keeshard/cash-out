// onboarding/type-selection.tsx
import { Building2, User } from "lucide-react";

interface TypeSelectionProps {
  onSelectType: (type: string) => void;
}

export default function TypeSelection({ onSelectType }: TypeSelectionProps) {
  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Choose Account Type
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Select the type of account you want to create
        </p>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={() => onSelectType("user-form")}
          className="w-full bg-stone-800 hover:bg-stone-700 transition border border-yellow-400/30 rounded-xl p-4 flex items-center"
        >
          <User className="h-10 w-10 text-yellow-400 mr-4" />
          <div className="text-left">
            <h3 className="text-white text-lg font-semibold">Individual</h3>
            <p className="text-gray-400 text-sm">
              For freelancers and individuals
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectType("business-form")}
          className="w-full bg-stone-800 hover:bg-stone-700 transition border border-yellow-400/30 rounded-xl p-4 flex items-center"
        >
          <Building2 className="h-10 w-10 text-yellow-400 mr-4" />
          <div className="text-left">
            <h3 className="text-white text-lg font-semibold">Business</h3>
            <p className="text-gray-400 text-sm">
              For companies and organizations
            </p>
          </div>
        </button>
      </div>
    </>
  );
}
