import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await Promise.resolve(params);
  if (!address) {
    return NextResponse.json(
      { error: "Missing address param" },
      { status: 400 }
    );
  }

  try {
    // Check for user account
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", address)
      .single();

    if (userData) {
      // Get invoices where user is requester
      const { data: requestedInvoices } = await supabase
        .from("invoices")
        .select(
          `
         *,
         requestee:businesses!invoices_requestee_fkey(
           wallet_address,
           name,
           image,
           email
         )
       `
        )
        .eq("requester", address)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        type: "user",
        data: userData,
        invoices_requested: requestedInvoices || [],
      });
    }

    // Check for business account
    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .select("*")
      .eq("wallet_address", address)
      .single();

    if (businessData) {
      // Get invoices where business is requestee
      const { data: receivedInvoices } = await supabase
        .from("invoices")
        .select(
          `
         *,
         requester:users!invoices_requester_fkey(
           wallet_address,
           name,
           image,
           email
         )
       `
        )
        .eq("requestee", address)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        type: "business",
        data: businessData,
        invoices_received: receivedInvoices || [],
      });
    }

    // Not registered
    return NextResponse.json({ type: "unregistered", data: null });
  } catch (error: any) {
    console.error("Error in /api/profile/[address]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
