
export type PaymentMethod = "momo" | "orange" | "paypal" | "bank";
export type TransactionType = "payment" | "withdrawal" | "bonus";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  payment_method: string;
  account_details: Record<string, any>;
  created_at: string;
  processed_at: string | null;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  name: string;
  account_number: string;
  details: Record<string, any>;
  is_default: boolean;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  notification_email: boolean;
  notification_app: boolean;
  dashboard_widgets: Record<string, boolean>;
  auto_withdrawal: boolean;
  auto_withdrawal_threshold: number | null;
  auto_withdrawal_method_id: string | null;
  created_at: string;
  updated_at: string;
}
