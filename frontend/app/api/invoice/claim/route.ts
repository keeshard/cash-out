// /api/invoice/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      requester,
      requestee,
      invoice,
      amount_requested,
      currency,
    } = body;

    // Validate required fields
    if (!requester || !requestee) {
      return NextResponse.json(
        { error: "Missing required fields: requester, requestee" },
        { status: 400 }
      );
    }

    // Verify requester exists as user
    const { data: requesterExists } = await supabase
      .from("users")
      .select("wallet_address")
      .eq("wallet_address", requester)
      .single();

    if (!requesterExists) {
      return NextResponse.json(
        { error: "Requester must be a registered user" },
        { status: 400 }
      );
    }

    // Verify requestee exists as business
    const { data: requesteeExists } = await supabase
      .from("businesses")
      .select("wallet_address")
      .eq("wallet_address", requestee)
      .single();

    if (!requesteeExists) {
      return NextResponse.json(
        { error: "Requestee must be a registered business" },
        { status: 400 }
      );
    }

    // Create invoice with claimed status
    const { data: newInvoice, error } = await supabase
      .from("invoices")
      .insert({
        title,
        description,
        requester,
        requestee,
        invoice,
        amount_requested,
        currency,
        status: "claimed",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    console.error("Error claiming invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
