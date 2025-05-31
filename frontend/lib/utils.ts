import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SelfAppBuilder } from "@selfxyz/qrcode";
import { v4 as uuidv4 } from "uuid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const userId = uuidv4();

// Create a SelfApp instance using the builder pattern
export const selfApp = new SelfAppBuilder({
  appName: "Cash Out",
  scope: "pharos-invoices",
  endpoint: "https://pharos-invoices.vercel.app/api/self-verify",
  endpointType: "https",
  logoBase64: "<base64EncodedLogo>", // Optional, accepts also PNG url
  userId,
}).build();

// Helper function to format currency with emoji
export function formatCurrency(currency: string) {
  const currencyMap: Record<string, string> = {
    pUSD: "🇺🇸 pUSD",
    pEUR: "🇪🇺 pEUR",
    pNGN: "🇳🇬 pNGN",
    pINR: "🇮🇳 pINR",
    pBRL: "🇧🇷 pBRL",
    pGBP: "🇬🇧 pGBP",
    pJPY: "🇯🇵 pJPY",
    pKES: "🇰🇪 pKES",
    pGHS: "🇬🇭 pGHS",
    pZAR: "🇿🇦 pZAR",
  };

  return currencyMap[currency] || currency;
}

// Hook to get all currencies
export function useCurrencies() {
  return [
    { code: "pUSD", label: "🇺🇸 pUSD", name: "Rootstock US Dollar" },
    { code: "pEUR", label: "🇪🇺 pEUR", name: "Rootstock Euro" },
    { code: "pNGN", label: "🇳🇬 pNGN", name: "Rootstock Nigerian Naira" },
    { code: "pINR", label: "🇮🇳 pINR", name: "Rootstock Indian Rupee" },
    { code: "pBRL", label: "🇧🇷 pBRL", name: "Rootstock Brazilian Real" },
    { code: "pGBP", label: "🇬🇧 pGBP", name: "Rootstock British Pound" },
    { code: "pJPY", label: "🇯🇵 pJPY", name: "Rootstock Japanese Yen" },
    { code: "pKES", label: "🇰🇪 pKES", name: "Rootstock Kenyan Shilling" },
    { code: "pGHS", label: "🇬🇭 pGHS", name: "Rootstock Ghanaian Cedi" },
    { code: "pZAR", label: "🇿🇦 pZAR", name: "Rootstock South African Rand" },
  ];
}
