"use client";
import dynamic from "next/dynamic";

const CreateInvoice = dynamic(() => import("@/components/create-invoice"), {
  ssr: false,
});

export default function CreateInvoicePage() {
  return <CreateInvoice />;
}
