import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-10 w-10 text-yellow-400 animate-spin mb-4" />
      <p className="text-stone-500 text-sm">{message}</p>
    </div>
  );
}
