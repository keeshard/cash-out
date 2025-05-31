import { Business, User } from "./database";
import { BusinessInvoice, UserInvoice } from "./invoice";

// profile.ts
export interface UserProfileResponse {
  type: "user";
  data: User;
  invoices_requested: UserInvoice[];
}

export interface BusinessProfileResponse {
  type: "business";
  data: Business;
  invoices_received: BusinessInvoice[];
}

export interface UnregisteredProfileResponse {
  type: "unregistered";
  data: null;
}

export interface ProfileErrorResponse {
  error: string;
}

export type ProfileResponse = UserProfileResponse | BusinessProfileResponse;
export type ProfileApiResponse =
  | ProfileResponse
  | ProfileErrorResponse
  | UnregisteredProfileResponse;
