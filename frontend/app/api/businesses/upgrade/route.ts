// app/api/businesses/increase-credit/route.ts
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { wallet, amount } = await request.json();

    const { error } = await supabase.rpc("increase_credit_amount", {
      business_wallet: wallet,
      amount,
    });

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error }, { status: 400 });
  }
}
