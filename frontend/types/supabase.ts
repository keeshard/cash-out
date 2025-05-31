import {
  User,
  UserInsert,
  Business,
  BusinessInsert,
  Invoice,
  InvoiceInsert,
} from "./database";

// supabase.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: Partial<UserInsert>;
      };
      businesses: {
        Row: Business;
        Insert: BusinessInsert;
        Update: Partial<BusinessInsert>;
      };
      invoices: {
        Row: Invoice;
        Insert: InvoiceInsert;
        Update: Partial<InvoiceInsert>;
      };
    };
    Views: {};
    Functions: {};
  };
}
