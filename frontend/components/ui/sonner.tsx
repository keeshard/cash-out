"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-stone-900 group-[.toaster]:text-white group-[.toaster]:border-stone-700 group-[.toaster]:shadow-lg group-[.toaster]:border font-bold",
          description: "text-stone-500 !text-stone-400 text-xs", // force override
          actionButton:
            "group-[.toast]:bg-[#FACC15] group-[.toast]:text-black font-semibold",
          cancelButton:
            "group-[.toast]:bg-black group-[.toast]:text-white border border-stone-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
