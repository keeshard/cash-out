import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  CreateProfileRequest,
  CreateUserRequest,
  CreateBusinessRequest,
} from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateProfileRequest = await request.json();

    const { type, wallet_address } = body;

    // Validate required fields
    if (!type || !wallet_address) {
      return NextResponse.json(
        { error: "Missing required fields: type, wallet_address" },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingChecks = await Promise.all([
      supabase
        .from("users")
        .select("wallet_address")
        .eq("wallet_address", wallet_address)
        .single(),
      supabase
        .from("businesses")
        .select("wallet_address")
        .eq("wallet_address", wallet_address)
        .single(),
    ]);

    const existingProfile = existingChecks.find((check) => check.data);
    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists for this wallet address" },
        { status: 409 }
      );
    }

    let result;

    switch (type) {
      case "user":
        const userBody = body as CreateUserRequest;
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({
            wallet_address: userBody.wallet_address,
            name: userBody.name,
            image: userBody.image,
            country: userBody.country,
            email: userBody.email,
            external_link: userBody.external_link,
          })
          .select()
          .single();

        if (userError) throw userError;
        result = { type: "user", data: newUser };
        break;

      case "business":
        const businessBody = body as CreateBusinessRequest;

        const { data: newBusiness, error: businessError } = await supabase
          .from("businesses")
          .insert({
            wallet_address: businessBody.wallet_address,
            name: businessBody.name,
            about: businessBody.about,
            image: businessBody.image,
            external_link: businessBody.external_link,
            email: businessBody.email,
            country: businessBody.country,
            owner: businessBody.owner,
            threshold: businessBody.threshold || 1,
            credit_amount: businessBody.credit_amount || 0,
            used_amount: businessBody.used_amount || 0,
            invoice_prover_address: businessBody.invoice_prover_address, // Add this line
          })
          .select()
          .single();

        if (businessError) throw businessError;

        result = { type: "business", data: newBusiness };
        break;
      default:
        return NextResponse.json(
          { error: "Invalid profile type. Must be 'user' or 'business'" },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
