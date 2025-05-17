
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserProfileCard } from "@/components/UserProfileCard";
import { PlatformsCarousel } from "@/components/PlatformsCarousel";
import { PaymentHistoryTable, PaymentHistoryItem } from "@/components/PaymentHistoryTable";
import { WithdrawalForm } from "@/components/WithdrawalForm";
import { generateMockPaymentHistory, generateMockPaymentMethods } from "@/lib/utils";
import { Wallet, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const History = () => {
  // Initialiser le solde à zéro au lieu de 4080
  const [balance, setBalance] = useState<number>(0);
  // Tableau vide pour les transactions au lieu de générer des fausses
  const [transactions, setTransactions] = useState<PaymentHistoryItem[]>([]);
  const savedPaymentMethods = generateMockPaymentMethods();

  // Handle withdrawal submission
  const handleWithdrawal = (data: any) => {
    // Create a new transaction
    const newTransaction: PaymentHistoryItem = {
      id: `tx-${Date.now()}`,
      date: new Date(),
      amount: data.amount,
      method: data.method as "momo" | "orange" | "paypal",
      account: savedPaymentMethods.find(m => m.type === data.method)?.accounts.find(a => a.id === data.account)?.number || "",
      status: "pending"
    };

    // Update transactions and balance
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => prev - data.amount);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full overflow-x-hidden">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          
          <div className="grid gap-6 md:grid-cols-12">
            {/* Balance Card */}
            <Card className="md:col-span-4 bg-gradient-to-br from-primary/10 to-secondary/5 border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <span>Solde Disponible</span>
                </CardTitle>
                <CardDescription>Montant disponible pour retrait</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                    minimumFractionDigits: 0
                  }).format(balance)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum de retrait: 50,000 FCFA
                </p>
              </CardContent>
            </Card>
            
            {/* Tabs for History and Withdrawal */}
            <div className="md:col-span-8">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Historique</span>
                  </TabsTrigger>
                  <TabsTrigger value="withdraw" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Faire un retrait</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="overflow-hidden">
                  <PaymentHistoryTable transactions={transactions} />
                </TabsContent>
                
                <TabsContent value="withdraw">
                  <WithdrawalForm balance={balance} savedMethods={savedPaymentMethods} onSubmit={handleWithdrawal} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
