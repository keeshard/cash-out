"use client";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

const AppProvider = dynamic(() => import("@/providers/app-provider"), {
  ssr: false,
});
const Layout = dynamic(() => import("@/components/layout"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground h-screen">
        <AppProvider>
          <Layout>{children}</Layout>
          <Toaster position="top-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
