import { NextRequest, NextResponse } from "next/server";
import {
  getUserIdentifier,
  SelfBackendVerifier,
  countryCodes,
  countries,
} from "@selfxyz/core";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proof, publicSignals } = body;

    if (!proof || !publicSignals) {
      return NextResponse.json(
        { message: "Proof and publicSignals are required" },
        { status: 400 }
      );
    }

    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId from verification result:", userId);

    // Default options
    let minimumAge = 18;
    let excludedCountryList: string[] = [
      countries.IRAN,
      countries.IRAQ,
      countries.NORTH_KOREA,
      countries.RUSSIA,
      countries.SYRIAN_ARAB_REPUBLIC,
      countries.VENEZUELA,
    ];
    let enableOfac = true;
    let enabledDisclosures = {
      issuing_state: false,
      name: true,
      nationality: true,
      date_of_birth: false,
      passport_number: false,
      gender: false,
      expiry_date: false,
      minimumAge: 18,
      excludedCountries: [
        countries.IRAN,
        countries.IRAQ,
        countries.NORTH_KOREA,
        countries.RUSSIA,
        countries.SYRIAN_ARAB_REPUBLIC,
        countries.VENEZUELA,
      ],
      ofac: true,
    };

    const configuredVerifier = new SelfBackendVerifier(
      "cash-out",
      process.env.NEXT_PUBLIC_DOMAIN || "",
      "uuid",
      true
    );

    if (minimumAge !== undefined) {
      configuredVerifier.setMinimumAge(minimumAge);
    }

    if (excludedCountryList.length > 0) {
      configuredVerifier.excludeCountries(
        ...(excludedCountryList as (keyof typeof countryCodes)[])
      );
    }

    if (enableOfac) {
      configuredVerifier.enableNameAndDobOfacCheck();
    }

    const result = await configuredVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      const filteredSubject = { ...result.credentialSubject };

      if (!enabledDisclosures.issuing_state && filteredSubject) {
        filteredSubject.issuing_state = "Not disclosed";
      }
      if (!enabledDisclosures.name && filteredSubject) {
        filteredSubject.name = "Not disclosed";
      }
      if (!enabledDisclosures.nationality && filteredSubject) {
        filteredSubject.nationality = "Not disclosed";
      }
      if (!enabledDisclosures.date_of_birth && filteredSubject) {
        filteredSubject.date_of_birth = "Not disclosed";
      }
      if (!enabledDisclosures.passport_number && filteredSubject) {
        filteredSubject.passport_number = "Not disclosed";
      }
      if (!enabledDisclosures.gender && filteredSubject) {
        filteredSubject.gender = "Not disclosed";
      }
      if (!enabledDisclosures.expiry_date && filteredSubject) {
        filteredSubject.expiry_date = "Not disclosed";
      }

      const insertVerifications = await supabase
        .from("verifications")
        .insert({
          id: userId,
          name:
            typeof filteredSubject.name === "string"
              ? filteredSubject.name
              : (filteredSubject.name as unknown as string[]).join(" "),
          nationality: filteredSubject.nationality,
        })
        .select();

      if (insertVerifications.error) {
        console.error(
          "Error inserting verification:",
          insertVerifications.error
        );
      }
      console.log("Verification inserted:", insertVerifications);

      return NextResponse.json({
        status: "success",
        result: result.isValid,
        credentialSubject: result.credentialSubject,
        verificationOptions: {
          minimumAge,
          ofac: enableOfac,
          excludedCountries: excludedCountryList.map((countryName) => {
            const entry = Object.entries(countryCodes).find(
              ([_, name]) => name === countryName
            );
            return entry ? entry[0] : countryName;
          }),
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          result: result.isValid,
          message: "Verification failed",
          details: result,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        message: "Error verifying proof",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
