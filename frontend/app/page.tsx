"use client";
import dynamic from "next/dynamic";

const HomeComponent = dynamic(() => import("@/components/home"), {
  ssr: false,
});

export default function HomePage() {
  return <HomeComponent />;
}
