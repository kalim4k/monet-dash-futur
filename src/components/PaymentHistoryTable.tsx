
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { CreditCard, Wallet } from "lucide-react";

export interface PaymentHistoryItem {
  id: string;
  date: Date;
  amount: number;
  method: "momo" | "orange" | "paypal";
  account: string;
  status: "completed" | "pending" | "failed";
}

interface PaymentHistoryTableProps {
  transactions: PaymentHistoryItem[];
}

export function PaymentHistoryTable({ transactions }: PaymentHistoryTableProps) {
  // Function to format currency in FCFA
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to get payment method display info
  const getMethodInfo = (method: string) => {
    switch (method) {
      case "momo":
        return {
          name: "MTN Mobile Money",
          color: "bg-[#FFCB05]",
          textColor: "text-black",
          icon: <Wallet className="h-4 w-4" />,
        };
      case "orange":
        return {
          name: "Orange Money",
          color: "bg-[#FF6600]",
          textColor: "text-white",
          icon: <Wallet className="h-4 w-4" />,
        };
      case "paypal":
        return {
          name: "PayPal",
          color: "bg-[#0070BA]",
          textColor: "text-white",
          icon: <CreditCard className="h-4 w-4" />,
        };
      default:
        return {
          name: "Autre",
          color: "bg-gray-500",
          textColor: "text-white",
          icon: <CreditCard className="h-4 w-4" />,
        };
    }
  };

  // Function to get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Historique des retraits récents</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] md:w-[180px]">Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead className="w-[80px] sm:w-auto">Méthode</TableHead>
              <TableHead className="hidden md:table-cell">Compte</TableHead>
              <TableHead className="w-[90px] md:w-auto">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun historique de retrait disponible
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const methodInfo = getMethodInfo(transaction.method);
                const statusBadge = getStatusBadge(transaction.status);
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md ${methodInfo.color} flex items-center justify-center ${methodInfo.textColor}`}>
                          {methodInfo.icon}
                        </div>
                        <span className="hidden sm:inline text-xs sm:text-sm">{methodInfo.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs sm:text-sm">
                      {transaction.account}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold ${statusBadge}`}>
                        {transaction.status === "completed" && "Terminé"}
                        {transaction.status === "pending" && "En attente"}
                        {transaction.status === "failed" && "Échoué"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
