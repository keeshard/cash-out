import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await Promise.resolve(params);
  if (!id) {
    return NextResponse.json({ error: "Missing id param" }, { status: 400 });
  }

  console.log("Received params:", id);

  try {
    const { data: verifiedData, error: verificationError } = await supabase
      .from("verifications")
      .select("*")
      .eq("id", id)
      .single();

    if (verifiedData) {
      return NextResponse.json({
        data: {
          name: verifiedData.name,
          nationality: verifiedData.nationality,
        },
        success: true,
      });
    } else {
      return NextResponse.json({
        error: verificationError,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching verification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch verification" },
      { status: 500 }
    );
  }
}
