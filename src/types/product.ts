
export type Product = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isActive?: boolean;
  createdAt?: string;
};

export type AffiliatePerformance = {
  id: string;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type UserProductStats = {
  id: string;
  product_id: string;
  totalClicks: number;
  uniqueClicks: number;
  conversionRate: number;
  earnings: number;
};

export type PaymentMethodType = {
  id: string;
  type: "momo" | "orange" | "paypal" | "bank";
  accounts: {
    id: string;
    type: string;
    number: string;
    name: string;
  }[];
};

export type Transaction = {
  id: string;
  date: Date;
  amount: number;
  method: "momo" | "orange" | "paypal";
  account: string;
  status: "completed" | "pending" | "failed";
};
