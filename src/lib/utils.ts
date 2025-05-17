
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
    account: methods[Math.floor(Math.random() * methods.length)] === "paypal" 
      ? "emma.dupont@example.com" 
      : `+237 ${Math.floor(Math.random() * 2) === 0 ? '655' : '677'} ${Math.random().toString().substring(2, 5)} ${Math.random().toString().substring(2, 5)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export const generateMockPaymentMethods = () => {
  return [
    {
      id: "momo-1",
      type: "momo" as const,
      accounts: [
        { id: "momo-acc-1", type: "momo", number: "+237 655 123 456", name: "Emma Dupont" }
      ]
    },
    {
      id: "orange-1",
      type: "orange" as const,
      accounts: [
        { id: "orange-acc-1", type: "orange", number: "+237 677 987 654", name: "Emma Dupont" }
      ]
    },
    {
      id: "paypal-1",
      type: "paypal" as const,
      accounts: [
        { id: "paypal-acc-1", type: "paypal", number: "emma.dupont@example.com", name: "Emma Dupont" }
      ]
    }
  ];
};
