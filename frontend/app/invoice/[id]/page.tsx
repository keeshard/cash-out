"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const InvoiceDetailComponent = dynamic(() => import("@/components/invoice"), {
  ssr: false,
});

export default function InvoiceDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <InvoiceDetailComponent id={id as string} />;
}
