export interface DashboardProfile {
  type: "user" | "business" | "signer";
  data: any;
}

export interface DashboardInvoice {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
  requester: string | null;
  requestee: string | null;
  signatures: Record<string, any>;
  invoice: string | null;
  amount_requested: number | null;
  currency: string | null;
  status:
    | "pending"
    | "approved"
    | "settled"
    | "claimed"
    | "claimed_and_settled";
  chain: string;
  threshold: number;
  signers_status: Array<{
    wallet_address: string;
    name: string | null;
    pfp: string | null;
    status: "approved" | "pending";
  }>;
  requester_user?: {
    wallet_address: string;
    alias: string | null;
    pfp: string | null;
  } | null;
  requestee_business?: {
    wallet_address: string;
    name: string | null;
    logo: string | null;
    threshold: number;
  } | null;
}

export interface BusinessInvoicesData {
  invoices: DashboardInvoice[];
  signers: any[];
  signer_invitations: any[];
  stats: {
    total_count: number;
    pending_count: number;
    approved_count: number;
    settled_count: number;
    total_amount: number;
    settled_amount: number;
  };
}

export interface SignerInvoicesData {
  invoices: DashboardInvoice[];
  businesses: any[];
  invitations: any[];
}
