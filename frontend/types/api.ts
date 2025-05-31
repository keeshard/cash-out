import { InvoiceStatus } from "./enums";

// Request types
export interface UpdateUserRequest {
  name?: string;
  image?: string;
  country?: string;
  email?: string;
  external_link?: string;
}

export interface CreateBusinessRequest {
  wallet_address: string;
  name?: string;
  about?: string;
  image?: string;
  external_link?: string;
  email?: string;
  country?: string;
  owner?: string;
  threshold?: number;
  credit_amount?: number;
  used_amount?: number;
}

export interface UpdateBusinessRequest {
  name?: string;
  about?: string;
  image?: string;
  external_link?: string;
  email?: string;
  country?: string;
  threshold?: number;
  credit_amount?: number;
  used_amount?: number;
}

export interface CreateInvoiceRequest {
  title?: string;
  description?: string;
  requester?: string;
  requestee?: string;
  invoice?: string;
  amount_requested?: number;
  currency?: string;
}

export interface UpdateInvoiceRequest {
  title?: string;
  description?: string;
  invoice?: string;
  amount_requested?: number;
  currency?: string;
  status?: InvoiceStatus;
}

// Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Query parameters
export interface GetBusinessesQuery {
  owner?: string;
  limit?: number;
  offset?: number;
}

export interface GetInvoicesQuery {
  requester?: string;
  requestee?: string;
  status?: InvoiceStatus;
  limit?: number;
  offset?: number;
}

export interface CreateUserRequest {
  type: "user";
  wallet_address: string;
  name?: string;
  image?: string;
  country?: string;
  email?: string;
  external_link?: string;
}

export interface CreateBusinessRequest {
  type: "business";
  wallet_address: string;
  name?: string;
  about?: string;
  image?: string;
  external_link?: string;
  email?: string;
  country?: string;
  owner?: string;
  threshold?: number;
  invoice_prover_address?: string;
  credit_amount?: number;
  used_amount?: number;
}

export type CreateProfileRequest = CreateUserRequest | CreateBusinessRequest;

export type VerifiedData = {
  name: string;
  nationality: string;
};
