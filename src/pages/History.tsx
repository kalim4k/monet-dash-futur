import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserProfileCard } from "@/components/UserProfileCard";
import { PlatformsCarousel } from "@/components/PlatformsCarousel";
import { PaymentHistoryTable, PaymentHistoryItem } from "@/components/PaymentHistoryTable";
import { WithdrawalForm } from "@/components/WithdrawalForm";
import { generateMockPaymentMethods } from "@/lib/utils";
import { Wallet, FileText, Plus, ArrowDown, ArrowUp, Clock, DollarSign, ChartPie } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyEarnings } from "@/components/WeeklyEarnings";
import { ProductRevenuePieChart } from "@/components/ProductRevenuePieChart";
import { toast } from "@/hooks/use-toast";
import { convertAccountDetails, PaymentMethod, PaymentMethodType } from "@/types/transaction";

// Constante pour le revenu par clic
const REVENUE_PER_CLICK = 10; // 10 FCFA par clic au lieu de 1 FCFA

const History = () => {
  const { user } = useAuth();
  
  // User earnings and stats state
  const [earnings, setEarnings] = useState({ total: 0, weekly: 0, clicks: 0, bonus: 0 });
  
  // Transaction history state
  const [transactions, setTransactions] = useState<PaymentHistoryItem[]>([]);
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(generateMockPaymentMethods());
  
  // Withdrawal count for tier system
  const [withdrawalCount, setWithdrawalCount] = useState(0);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load user statistics from Supabase
  const loadUserStats = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Get total clicks (to calculate earnings at 10 FCFA per click)
      const { data: clicksData, error: clicksError } = await supabase.rpc(
        'get_affiliate_earnings',
        { user_id: userId }
      );
      
      // Get weekly clicks (for weekly earnings at 10 FCFA per click)
      const { data: weeklyClicksData, error: weeklyError } = await supabase.rpc(
        'get_affiliate_weekly_earnings',
        { user_id: userId }
      );
      
      // Calculate total earnings (10 FCFA per click)
      const totalEarnings = (clicksData || 0) * REVENUE_PER_CLICK;
      
      // Calculate weekly earnings (10 FCFA per click)
      const weeklyEarnings = (weeklyClicksData || 0) * REVENUE_PER_CLICK;
      
      // Get total withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('transaction_type', 'withdrawal')
        .in('status', ['completed', 'pending']);
        
      const totalWithdrawals = withdrawalsData ? withdrawalsData.reduce((sum, tx) => sum + tx.amount, 0) : 0;
      
      // Calculate available balance
      const availableBalance = Math.max(0, totalEarnings - totalWithdrawals);
      
      if (clicksError || weeklyError || withdrawalsError) {
        throw new Error("Erreur lors du chargement des statistiques");
      }
      
      setEarnings({
        total: availableBalance,
        weekly: weeklyEarnings,
        clicks: clicksData || 0,
        bonus: 0 // Pour le moment, pas de système de bonus
      });
      
      // Load transaction history
      await loadTransactions(userId);
      
      // Load payment methods
      await loadPaymentMethods(userId);
      
      // Calculate number of successful withdrawals for tier system
      const { count: completedWithdrawalCount, error: withdrawalError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('transaction_type', 'withdrawal')
        .in('status', ['completed', 'pending']);
        
      if (!withdrawalError) {
        setWithdrawalCount(completedWithdrawalCount || 0);
      }
      
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos statistiques financières",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load transaction history
  const loadTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert Supabase data to PaymentHistoryItem format
      const formattedTransactions: PaymentHistoryItem[] = data.map(tx => {
        // Safely extract account number
        let accountNumber = '';
        if (tx.account_details) {
          const details = convertAccountDetails(tx.account_details);
          accountNumber = details.number || '';
        }
        
        return {
          id: tx.id,
          date: new Date(tx.created_at),
          amount: tx.amount,
          method: tx.payment_method as "momo" | "orange" | "paypal" | "wave" | "moov" | "yass",
          account: accountNumber,
          status: tx.status as "completed" | "pending" | "failed"
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
    }
  };
  
  // Load payment methods from Supabase
  const loadPaymentMethods = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Group payment methods by type
        const methodsByType = data.reduce((acc, method) => {
          const type = method.type as PaymentMethodType;
          if (!acc[type]) {
            acc[type] = {
              id: type,
              type: type,
              accounts: []
            };
          }
          acc[type].accounts.push({
            id: method.id,
            type: method.type,
            number: method.account_number,
            name: method.name
          });
          return acc;
        }, {} as Record<string, PaymentMethod>);
        
        setPaymentMethods(Object.values(methodsByType));
      } else {
        // Si aucune méthode n'est trouvée, ajouter au moins les méthodes par défaut
        const defaultMethods: PaymentMethod[] = [
          {
            id: "paypal",
            type: "paypal",
            accounts: []
          },
          {
            id: "momo",
            type: "momo",
            accounts: []
          },
          {
            id: "orange",
            type: "orange",
            accounts: []
          },
          {
            id: "wave",
            type: "wave",
            accounts: []
          },
          {
            id: "moov",
            type: "moov",
            accounts: []
          },
          {
            id: "yass",
            type: "yass",
            accounts: []
          }
        ];
        setPaymentMethods(defaultMethods);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des méthodes de paiement:", error);
    }
  };
  
  // Load user data when user is authenticated
  useEffect(() => {
    if (user?.id) {
      loadUserStats(user.id);
    }
  }, [user]);

  // Handle withdrawal submission
  const handleWithdrawal = async (data: any) => {
    if (!user?.id) return;
    
    try {
      // Create transaction in Supabase
      const { data: transactionData, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: data.amount,
          transaction_type: 'withdrawal',
          status: 'pending',
          payment_method: data.method,
          account_details: {
            id: data.account,
            number: paymentMethods.find(m => m.type === data.method)?.accounts.find(a => a.id === data.account)?.number || ""
          },
          description: `Retrait vers ${
            data.method === 'momo' ? 'MTN Mobile Money' : 
            data.method === 'orange' ? 'Orange Money' : 
            data.method === 'paypal' ? 'PayPal' : 
            data.method === 'wave' ? 'Wave' : 
            data.method === 'moov' ? 'Moov Money' : 
            data.method === 'yass' ? 'Yass' : 
            'Autre'
          }`
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update transactions list
      const newTransaction: PaymentHistoryItem = {
        id: transactionData.id,
        date: new Date(transactionData.created_at),
        amount: transactionData.amount,
        method: transactionData.payment_method as "momo" | "orange" | "paypal" | "wave" | "moov" | "yass",
        account: transactionData.account_details && typeof transactionData.account_details === 'object' ? 
          (convertAccountDetails(transactionData.account_details).number || '') : '',
        status: "pending"
      };
      
      // Update transactions and refresh balance
      setTransactions([newTransaction, ...transactions]);
      setWithdrawalCount(prevCount => prevCount + 1);
      
      // Refresh earnings
      if (user?.id) {
        // Recalculate balance manually to avoid race conditions with the database
        setEarnings(prev => ({ ...prev, total: Math.max(0, prev.total - data.amount) }));
      }
      
      toast({
        title: "Demande de retrait envoyée",
        description: `Votre demande de retrait de ${formatCurrency(data.amount)} a été enregistrée et est en cours de traitement.`,
      });
    } catch (error) {
      console.error("Erreur lors de la demande de retrait:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande de retrait",
        variant: "destructive",
      });
    }
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = earnings.total + transactions.reduce((sum, tx) => tx.status === "completed" ? sum + tx.amount : sum, 0);
  const totalWithdrawal = transactions.filter(tx => tx.status !== "failed").reduce((sum, tx) => sum + tx.amount, 0);
  const pendingAmount = transactions.filter(tx => tx.status === "pending").reduce((sum, tx) => sum + tx.amount, 0);

  // Déterminer le palier actuel
  const getCurrentTier = () => {
    if (withdrawalCount === 0) return 1000;
    if (withdrawalCount === 1) return 15000;
    return 50000;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full overflow-x-hidden">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finances</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos revenus et retraits</p>
            <p className="text-xs text-blue-500 mt-1">Nouveau: gagnez 10 FCFA par clic!</p>
          </div>
          
          {/* Financial Overview Cards */}
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
                  10 FCFA par clic
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
                <div className="text-3xl font-bold">{formatCurrency(earnings.clicks * REVENUE_PER_CLICK)}</div>
                <p className="text-xs opacity-80 mt-1">
                  {earnings.clicks.toLocaleString()} clics
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
          
          {/* Charts Section */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
            <Card className="shadow-md border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Gains de la Semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyEarnings />
              </CardContent>
            </Card>
            
            {/* Product Revenue Pie Chart */}
            <ProductRevenuePieChart />
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
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <PaymentHistoryTable transactions={transactions} />
                  )}
                </TabsContent>
                
                <TabsContent value="withdraw" className="mt-0">
                  <WithdrawalForm 
                    balance={earnings.total} 
                    savedMethods={paymentMethods} 
                    onSubmit={handleWithdrawal} 
                    withdrawalCount={withdrawalCount}
                  />
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
