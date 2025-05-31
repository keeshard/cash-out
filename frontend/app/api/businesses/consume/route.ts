import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { wallet, amount } = await request.json();

    const { error } = await supabase.rpc("consume_amount", {
      business_wallet: wallet,
      amount,
    });

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error }, { status: 400 });
  }
}
