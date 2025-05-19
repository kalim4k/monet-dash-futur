
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserProfileCard } from "@/components/UserProfileCard";
import { PlatformsCarousel } from "@/components/PlatformsCarousel";
import { PaymentHistoryTable, PaymentHistoryItem } from "@/components/PaymentHistoryTable";
import { WithdrawalForm } from "@/components/WithdrawalForm";
import { generateMockPaymentHistory, generateMockPaymentMethods } from "@/lib/utils";
import { Wallet, FileText, Plus, ArrowDown, ArrowUp, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const History = () => {
  const { user } = useAuth();
  // État pour les gains et les statistiques de l'utilisateur
  const [earnings, setEarnings] = useState({ total: 0, weekly: 0, clicks: 0, bonus: 0 });
  // Tableau vide pour les transactions au lieu de générer des fausses
  const [transactions, setTransactions] = useState<PaymentHistoryItem[]>([]);
  const savedPaymentMethods = generateMockPaymentMethods();

  // Chargement des statistiques utilisateur depuis Supabase
  const loadUserStats = async (userId: string) => {
    try {
      // Récupérer les revenus totaux (1 FCFA par clic)
      const { data: totalEarnings, error: totalError } = await supabase.rpc(
        'get_affiliate_earnings', 
        { user_id: userId }
      );
      
      // Récupérer les revenus hebdomadaires (1 FCFA par clic)
      const { data: weeklyEarnings, error: weeklyError } = await supabase.rpc(
        'get_affiliate_weekly_earnings',
        { user_id: userId }
      );
      
      // Récupérer le nombre total de clics
      const { data: clicksData, error: clicksError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('user_id', userId)
        .then(async ({ data, error }) => {
          if (error) throw error;
          if (!data || data.length === 0) return { data: 0, error: null };
          
          const linkIds = data.map(link => link.id);
          const { count, error: countError } = await supabase
            .from('clicks')
            .select('*', { count: 'exact', head: true })
            .in('affiliate_link_id', linkIds as string[]);
            
          return { data: count || 0, error: countError };
        });
      
      if (totalError || weeklyError || clicksError) {
        throw new Error("Erreur lors du chargement des statistiques");
      }
      
      setEarnings({
        // 1 FCFA par clic
        total: totalEarnings || 0, 
        weekly: weeklyEarnings || 0,
        clicks: clicksData || 0,
        bonus: 0 // Pour le moment, pas de système de bonus
      });
      
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };
  
  // Charger les statistiques si l'utilisateur est connecté
  useEffect(() => {
    if (user?.id) {
      loadUserStats(user.id);
    }
  }, [user]);

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
    setEarnings(prev => ({ ...prev, total: prev.total - data.amount }));
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = earnings.total; // Utiliser le total des gains disponibles
  const totalWithdrawal = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const pendingAmount = transactions.filter(tx => tx.status === "pending").reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full overflow-x-hidden">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finances</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos revenus et retraits</p>
          </div>
          
          {/* Financial Overview Cards - Updated to grid-cols-2 sm:grid-cols-4 to match homepage */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Wallet className="h-5 w-5 mr-2" />
                  Solde Disponible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(earnings.total)}</div>
                <p className="text-xs opacity-80 mt-1">
                  Minimum de retrait: 50,000 FCFA
                </p>
              </CardContent>
            </Card>
            
            {/* Total Income Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-none text-white shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <ArrowDown className="h-5 w-5 mr-2" />
                  Total des Gains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalIncome)}</div>
                <p className="text-xs opacity-80 mt-1">
                  Revenus cumulés
                </p>
              </CardContent>
            </Card>
            
            {/* Total Withdrawals Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 border-none text-white shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <ArrowUp className="h-5 w-5 mr-2" />
                  Total des Retraits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalWithdrawal)}</div>
                <p className="text-xs opacity-80 mt-1">
                  Montant total retiré
                </p>
              </CardContent>
            </Card>
            
            {/* Pending Withdrawals Card */}
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-none text-white shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Retraits en Attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(pendingAmount)}</div>
                <p className="text-xs opacity-80 mt-1">
                  En cours de traitement
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for History and Withdrawal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-t-xl">
                <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Historique</span>
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Faire un retrait</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="history" className="overflow-hidden mt-0">
                  <PaymentHistoryTable transactions={transactions} />
                </TabsContent>
                
                <TabsContent value="withdraw" className="mt-0">
                  <WithdrawalForm balance={earnings.total} savedMethods={savedPaymentMethods} onSubmit={handleWithdrawal} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
