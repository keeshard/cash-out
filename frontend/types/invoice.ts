import { InvoiceStatus } from "./enums";

// invoice.ts
export interface BaseEnrichedInvoice {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
  requester: string | null;
  requestee: string | null;
  invoice: string | null;
  amount_requested: number | null;
  currency: string | null;
  status: InvoiceStatus;
}

export interface UserInvoice extends BaseEnrichedInvoice {
  requestee_business: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface BusinessInvoice extends BaseEnrichedInvoice {
  requester_user: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface InvoiceStats {
  total_count: number;
  claimed_count: number;
  settled_count: number;
  total_amount: number;
  settled_amount: number;
}

export type UserInvoicesResponse = UserInvoice[];

export interface BusinessInvoicesResponse {
  invoices: BusinessInvoice[];
  stats: InvoiceStats;
}

export type ProfileInvoicesResponse =
  | UserInvoicesResponse
  | BusinessInvoicesResponse
  | [];
