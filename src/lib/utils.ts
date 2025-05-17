
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  } catch (error) {
    return 'Date invalide'
  }
}

// Mock data generators for the app
export const generateMockPaymentHistory = (count = 5) => {
  const methods = ["momo", "orange", "paypal"] as const;
  const statuses = ["completed", "pending", "failed"] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tx-${i + 1}${Math.random().toString(36).substring(2, 7)}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    amount: Math.floor(Math.random() * 900000) + 50000,
    method: methods[Math.floor(Math.random() * methods.length)],
    account: [`+237 655 123 456`, `+237 677 987 654`, `emma.dupont@example.com`][Math.floor(Math.random() * 3)],
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export const generateMockPaymentMethods = () => {
  return [
    {
      id: "momo-1",
      type: "momo",
      accounts: [
        { id: "momo-acc-1", type: "momo", number: "+237 655 123 456", name: "Emma Dupont" }
      ]
    },
    {
      id: "orange-1",
      type: "orange",
      accounts: [
        { id: "orange-acc-1", type: "orange", number: "+237 677 987 654", name: "Emma Dupont" }
      ]
    },
    {
      id: "paypal-1",
      type: "paypal",
      accounts: [
        { id: "paypal-acc-1", type: "paypal", number: "emma.dupont@example.com", name: "Emma Dupont" }
      ]
    }
  ];
};
