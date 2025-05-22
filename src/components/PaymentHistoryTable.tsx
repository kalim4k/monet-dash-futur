
import { Wallet, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface PaymentHistoryItem {
  id: string;
  date: Date;
  amount: number;
  method: "momo" | "orange" | "paypal" | "wave" | "moov" | "yass";
  account: string;
  status: "completed" | "pending" | "failed";
}

interface PaymentHistoryTableProps {
  transactions: PaymentHistoryItem[];
}

export function PaymentHistoryTable({ transactions }: PaymentHistoryTableProps) {
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  };
  
  // Get method display name
  const getMethodName = (method: string) => {
    switch (method) {
      case "momo": return "MTN Mobile Money";
      case "orange": return "Orange Money";
      case "paypal": return "PayPal";
      case "wave": return "Wave";
      case "moov": return "Moov Money";
      case "yass": return "Yass";
      default: return method;
    }
  };
  
  // Get method icon/logo
  const getMethodLogo = (method: string) => {
    switch (method) {
      case "momo": return "https://celinaroom.com/wp-content/uploads/2025/01/mtn-1-Copie.jpg";
      case "orange": return "https://celinaroom.com/wp-content/uploads/2025/01/Orange-Money-recrute-pour-ce-poste-22-Mars-2023.png";
      case "paypal": return "https://celinaroom.com/wp-content/uploads/2025/01/ENIGME3.png";
      case "wave": return "https://celinaroom.com/wp-content/uploads/2025/02/Design-sans-titre4.png";
      case "moov": return "https://celinaroom.com/wp-content/uploads/2025/01/Moov_Money_Flooz.png";
      case "yass": return "https://celinaroom.com/wp-content/uploads/2025/05/mixx-by-yas.jpg";
      default: return "";
    }
  };
  
  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 text-green-700 border-green-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "failed": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Complété";
      case "pending": return "En cours";
      case "failed": return "Échoué";
      default: return status;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div>
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <Wallet className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Aucune transaction</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
            Vous n'avez pas encore effectué de retrait. Vos transactions apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Compte</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{formatDate(transaction.date)}</div>
                    <div className="text-xs text-gray-500">ID: {transaction.id.substring(0, 8)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                        {transaction.method && (
                          <img 
                            src={getMethodLogo(transaction.method)} 
                            alt={getMethodName(transaction.method)} 
                            className="h-full w-full object-cover" 
                          />
                        )}
                      </div>
                      <span>{getMethodName(transaction.method)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColorClass(transaction.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        {getStatusText(transaction.status)}
                      </span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
