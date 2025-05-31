// /api/invoice/settle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id } = body;

    if (!invoice_id) {
      return NextResponse.json(
        { error: "Missing required field: invoice_id" },
        { status: 400 }
      );
    }

    // Verify invoice exists and is in claimed status
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id, status")
      .eq("id", invoice_id)
      .single();

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (existingInvoice.status !== "claimed") {
      return NextResponse.json(
        { error: "Invoice must be in claimed status to settle" },
        { status: 400 }
      );
    }

    // Update status to settled
    const { data: updatedInvoice, error } = await supabase
      .from("invoices")
      .update({ status: "settled" })
      .eq("id", invoice_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error: any) {
    console.error("Error settling invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
