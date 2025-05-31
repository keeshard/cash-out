// database.ts
import { InvoiceStatus } from "./enums";

export interface User {
  wallet_address: string;
  name: string | null;
  created_at: string;
  image: string | null;
  country: string | null;
  email: string | null;
  external_link: string | null;
}

export interface UserInsert {
  wallet_address: string;
  name?: string | null;
  image?: string | null;
  country?: string | null;
  email?: string | null;
  external_link?: string | null;
}

export interface UserUpdate {
  name?: string | null;
  image?: string | null;
  country?: string | null;
  email?: string | null;
  external_link?: string | null;
}

export interface Business {
  wallet_address: string;
  created_at: string;
  name: string | null;
  about: string | null;
  image: string | null;
  external_link: string | null;
  email: string | null;
  country: string | null;
  owner: string | null;
  threshold: number | null;
  credit_amount: number | null;
  used_amount: number | null;
  invoice_prover_address: string | null; // New field
}

export interface BusinessInsert {
  wallet_address: string;
  name?: string | null;
  about?: string | null;
  image?: string | null;
  external_link?: string | null;
  email?: string | null;
  country?: string | null;
  owner?: string | null;
  threshold?: number | null;
  credit_amount?: number | null;
  used_amount?: number | null;
  invoice_prover_address?: string | null; // New field
}

export interface Invoice {
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

export interface InvoiceInsert {
  title?: string | null;
  description?: string | null;
  requester?: string | null;
  requestee?: string | null;
  invoice?: string | null;
  amount_requested?: number | null;
  currency?: string | null;
  status?: InvoiceStatus;
}

// dashboard.ts
export interface DashboardProfile {
  type: "user" | "business";
  data: any;
}

export interface DashboardInvoice {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
  requester: string | null;
  requestee: string | null;
  invoice: string | null;
  amount_requested: number | null;
  currency: string | null;
  status: "claimed" | "settled";
  requester_user?: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
  requestee_business?: {
    wallet_address: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface BusinessInvoicesData {
  invoices: DashboardInvoice[];
  stats: {
    total_count: number;
    claimed_count: number;
    settled_count: number;
    total_amount: number;
    settled_amount: number;
  };
}
