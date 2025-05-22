
import { Json } from "@/integrations/supabase/types";

export type TransactionType = "payment" | "withdrawal" | "bonus";
export type TransactionStatus = "completed" | "pending" | "failed";
export type PaymentMethodType = "momo" | "orange" | "paypal" | "bank" | "wave" | "moov" | "yass";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  payment_method: string;
  account_details: AccountDetails;
  created_at: string;
  processed_at: string | null;
}

export interface AccountDetails {
  number?: string;
  id?: string;
  method_id?: string;
  [key: string]: any;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  accounts: {
    id: string;
    type: string;
    number: string;
    name: string;
  }[];
}

// Helper to safely convert from Supabase JSON type to AccountDetails
export function convertAccountDetails(details: Json | null): AccountDetails {
  if (!details) return {};
  
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch {
      return {};
    }
  }
  
  return details as AccountDetails;
}
