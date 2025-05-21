import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wallet, 
  ArrowDownToLine, 
  CreditCard, 
  Receipt, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  BarChart4, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: 'payment' | 'withdrawal' | 'bonus';
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  account_details: any;
  created_at: string;
  processed_at: string | null;
}

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  account_number: string;
  is_default: boolean;
  details?: any;
}

const Payments = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Financial data
  const [balance, setBalance] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyGoal, setMonthlyGoal] = useState({ current: 0, target: 10000 });
  
  // Fetch user financial data
  useEffect(() => {
    if (user?.id) {
      fetchFinancialData();
      fetchTransactions();
      fetchPaymentMethods();
    }
  }, [user]);
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  };
  
  // Fetch financial data from Supabase
  const fetchFinancialData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Get account balance
      const { data: balanceData, error: balanceError } = await supabase.rpc(
        'get_user_account_balance',
        { user_id: user.id }
      );
      
      if (balanceError) throw balanceError;
      
      // Get weekly earnings (as pending earnings)
      const { data: weeklyData, error: weeklyError } = await supabase.rpc(
        'get_affiliate_weekly_earnings',
        { user_id: user.id }
      );
      
      if (weeklyError) throw weeklyError;
      
      // Get total earnings (1 FCFA per click)
      const { data: clicksData, error: clicksError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('user_id', user.id)
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
      
      if (clicksError) throw clicksError;
      
      setBalance(balanceData || 0);
      setPendingEarnings(weeklyData || 0);
      setTotalEarnings(clicksData || 0);
      
      // Calculate monthly goal progress (simple example)
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Get clicks this month
      const { data: monthlyClicks, error: monthlyError } = await supabase
        .from('clicks')
        .select('id')
        .join('affiliate_links', 'affiliate_links.id=clicks.affiliate_link_id')
        .eq('affiliate_links.user_id', user.id)
        .gte('clicked_at', startOfMonth.toISOString())
        .count();
      
      if (monthlyError) throw monthlyError;
      
      setMonthlyGoal({
        current: monthlyClicks || 0,
        target: 10000 // Example target
      });
      
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données financières",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setPaymentMethods(data || []);
      
      // Set default payment method if available
      const defaultMethod = data?.find(method => method.is_default);
      if (defaultMethod) {
        setPaymentMethod(defaultMethod.type);
        if (defaultMethod.type === 'momo' || defaultMethod.type === 'orange') {
          setMobileNumber(defaultMethod.account_number);
        }
      }
      
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };
  
  // Handle withdrawal request
  const handleWithdraw = async () => {
    if (!user?.id) return;
    
    const amount = Number(withdrawAmount);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez saisir un montant valide pour le retrait.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Solde insuffisant",
        description: "Le montant demandé dépasse votre solde disponible.",
        variant: "destructive",
      });
      return;
    }
    
    if (!mobileNumber && (paymentMethod === 'momo' || paymentMethod === 'orange')) {
      toast({
        title: "Numéro manquant",
        description: "Veuillez saisir un numéro de téléphone valide.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Determine payment method details
      let methodName = "";
      switch (paymentMethod) {
        case 'momo':
          methodName = "MTN Mobile Money";
          break;
        case 'orange':
          methodName = "Orange Money";
          break;
        case 'bank':
          methodName = "Virement bancaire";
          break;
        case 'paypal':
          methodName = "PayPal";
          break;
        default:
          methodName = "Autre";
      }
      
      // Save or update payment method if phone number provided
      let paymentMethodId = '';
      
      if (mobileNumber && (paymentMethod === 'momo' || paymentMethod === 'orange')) {
        // Check if this payment method already exists
        const existingMethod = paymentMethods.find(
          m => m.type === paymentMethod && m.account_number === mobileNumber
        );
        
        if (existingMethod) {
          paymentMethodId = existingMethod.id;
        } else {
          // Create new payment method
          const { data: newMethod, error: methodError } = await supabase
            .from('payment_methods')
            .insert({
              user_id: user.id,
              type: paymentMethod,
              name: methodName,
              account_number: mobileNumber,
              is_default: paymentMethods.length === 0 // Make default if it's the first one
            })
            .select()
            .single();
          
          if (methodError) throw methodError;
          
          paymentMethodId = newMethod.id;
          
          // Update local state
          setPaymentMethods([...paymentMethods, newMethod]);
        }
      }
      
      // Create withdrawal transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: amount,
          transaction_type: 'withdrawal',
          status: 'pending',
          payment_method: paymentMethod,
          account_details: {
            number: mobileNumber,
            method_id: paymentMethodId
          },
          description: `Retrait vers ${methodName}`
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setTransactions([transaction, ...transactions]);
      setBalance(prevBalance => prevBalance - amount);
      setWithdrawAmount("");
      
      toast({
        title: "Demande de retrait envoyée",
        description: `Votre retrait de ${formatCurrency(amount)} FCFA a été soumis et sera traité prochainement.`,
      });
      
    } catch (error) {
      console.error("Erreur lors de la demande de retrait:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande de retrait.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Save payment method
  const handleSavePaymentMethod = async (type: string, account: string, name: string) => {
    if (!user?.id || !account || !name) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: type,
          name: name,
          account_number: account,
          is_default: paymentMethods.length === 0 // Make default if first one
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods([...paymentMethods, data]);
      
      toast({
        title: "Méthode de paiement ajoutée",
        description: "Votre nouvelle méthode de paiement a été enregistrée.",
      });
      
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la méthode de paiement.",
        variant: "destructive",
      });
    }
  };
  
  // Set default payment method
  const handleSetDefaultMethod = async (methodId: string) => {
    if (!user?.id) return;
    
    try {
      // First, set all methods to not default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', methodId);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        is_default: method.id === methodId
      })));
      
      toast({
        title: "Méthode par défaut mise à jour",
        description: "Votre méthode de paiement par défaut a été mise à jour.",
      });
      
    } catch (error) {
      console.error("Error setting default method:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la méthode par défaut.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Paiements
                </h1>
                {!isMobile && (
                  <p className="text-muted-foreground text-sm mt-1">
                    Gérez vos revenus et vos méthodes de paiement
                  </p>
                )}
              </div>
            </div>
          </header>
          
          {/* Payments Content */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid grid-cols-5 mb-8 w-full md:w-auto">
              <TabsTrigger value="dashboard" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <BarChart4 className="h-5 w-5" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Clock className="h-5 w-5" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <ArrowDownToLine className="h-5 w-5" />
                <span className="hidden sm:inline">Retraits</span>
              </TabsTrigger>
              <TabsTrigger value="methods" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Wallet className="h-5 w-5" />
                <span className="hidden sm:inline">Méthodes</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">Fiscalité</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Financial Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Financial Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" /> 
                        Résumé financier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-sm">
                          <p className="text-sm text-gray-500">Solde disponible</p>
                          <h3 className="text-3xl font-bold mt-2">{formatCurrency(balance)}</h3>
                          <p className="text-xs text-green-600 mt-1">Prêt à être retiré</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm">
                          <p className="text-sm text-gray-500">Gains en attente</p>
                          <h3 className="text-3xl font-bold mt-2">{formatCurrency(pendingEarnings)}</h3>
                          <p className="text-xs text-blue-600 mt-1">Disponible dans 3 jours</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm">
                          <p className="text-sm text-gray-500">Revenus totaux</p>
                          <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalEarnings)}</h3>
                          <p className="text-xs text-purple-600 mt-1">Depuis le début</p>
                        </div>
                      </div>
                      
                      {/* Monthly Progress */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h4 className="font-medium">Objectif mensuel</h4>
                            <p className="text-sm text-gray-500">{new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{monthlyGoal.current} / {monthlyGoal.target} FCFA</p>
                            <p className="text-sm text-gray-500">{Math.round((monthlyGoal.current / monthlyGoal.target) * 100)}% atteint</p>
                          </div>
                        </div>
                        <Progress value={(monthlyGoal.current / monthlyGoal.target) * 100} className="h-2" />
                      </div>
                      
                      {/* Recent Payments */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Paiements récents</h4>
                          <Button variant="outline" size="sm" onClick={() => document.querySelector('[data-state="inactive"][data-value="history"]')?.click()}>
                            Voir tout
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {transactions.slice(0, 2).map(transaction => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center
                                  ${transaction.status === 'completed' ? 'bg-green-100' : 
                                    transaction.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'}`}>
                                  {transaction.status === 'completed' ? 
                                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                    transaction.status === 'pending' ? 
                                      <Clock className="h-4 w-4 text-amber-500" /> : 
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                  }
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {transaction.transaction_type === 'withdrawal' ? 'Retrait' : 
                                     transaction.transaction_type === 'payment' ? 'Paiement reçu' : 
                                     'Bonus'}
                                  </p>
                                  <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                                </div>
                              </div>
                              <p className={`font-medium ${transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                                {transaction.transaction_type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          ))}
                          
                          {transactions.length === 0 && (
                            <div className="text-center p-6 text-gray-500">
                              Aucune transaction récente
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Payment Stats Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart4 className="h-5 w-5" /> 
                        Statistiques de paiement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">Moyenne mensuelle</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {formatCurrency(Math.round(totalEarnings / (new Date().getMonth() + 1 || 1)))}
                          </h3>
                          <p className="text-xs text-green-600 mt-1">↑ 12% vs mois précédent</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">Revenus par clic</p>
                          <h3 className="text-2xl font-bold mt-1">1.0 FCFA</h3>
                          <p className="text-xs text-gray-500 mt-1">Taux standard</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">Prochaine date de paiement</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'})}
                          </h3>
                          <p className="text-xs text-blue-600 mt-1">Dans 7 jours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
            
            {/* Transaction History */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" /> 
                    Historique des transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input placeholder="Rechercher..." />
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="payment">Paiements</SelectItem>
                        <SelectItem value="withdrawal">Retraits</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all_time">
                      <SelectTrigger>
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_time">Toute la période</SelectItem>
                        <SelectItem value="this_month">Ce mois</SelectItem>
                        <SelectItem value="last_month">Mois dernier</SelectItem>
                        <SelectItem value="this_year">Cette année</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" /> Exporter
                    </Button>
                  </div>
                  
                  {/* Transactions List */}
                  <div className="border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-4 text-sm font-medium">
                      <div>Description</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div className="text-right">Montant</div>
                    </div>
                    
                    {/* Table Rows */}
                    <div className="space-y-0">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : transactions.length > 0 ? (
                        transactions.map(transaction => (
                          <div key={transaction.id} className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                            <div>
                              <p className="font-medium">
                                {transaction.description || (
                                  transaction.transaction_type === 'withdrawal' ? 'Retrait' : 
                                  transaction.transaction_type === 'payment' ? 'Paiement reçu' : 
                                  'Bonus'
                                )}
                              </p>
                              <p className="text-xs text-gray-500">#{transaction.id.substring(0, 8)}</p>
                            </div>
                            <div className="flex items-center">
                              <p>{formatDate(transaction.created_at)}</p>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className={`
                                ${transaction.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  transaction.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                  'bg-red-50 text-red-700 border-red-200'}
                              `}>
                                {transaction.status === 'completed' ? 'Complété' : 
                                  transaction.status === 'pending' ? 'En cours' : 
                                  'Échoué'}
                              </Badge>
                            </div>
                            <div className={`text-right font-medium ${
                              transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.transaction_type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8 text-gray-500">
                          Aucune transaction trouvée
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  {transactions.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Affichage de 1-{Math.min(transactions.length, 10)} sur {transactions.length} transactions</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Précédent</Button>
                        <Button variant="outline" size="sm">Suivant</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Withdrawals */}
            <TabsContent value="withdrawals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Withdraw Form */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowDownToLine className="h-5 w-5" /> 
                      Demande de retrait
                    </CardTitle>
                    <CardDescription>
                      Retirez vos gains vers votre compte préféré
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Montant</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">
                            FCFA
                          </span>
                          <Input 
                            type="number" 
                            placeholder="0"
                            className="pl-14" 
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Minimum: 1 000 FCFA | Maximum: {formatCurrency(balance)}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Méthode de paiement</label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isSubmitting}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momo">Mobile Money</SelectItem>
                            <SelectItem value="orange">Orange Money</SelectItem>
                            <SelectItem value="bank">Virement bancaire</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {(paymentMethod === "momo" || paymentMethod === "orange") && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro Mobile Money</label>
                          <Input 
                            placeholder="Exemple: 97 12 34 56" 
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                      
                      {paymentMethod === "bank" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">IBAN</label>
                          <Input 
                            placeholder="FRXX XXXX XXXX XXXX XXXX XXXX XXX"
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                      
                      {paymentMethod === "paypal" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email PayPal</label>
                          <Input 
                            placeholder="votre-email@exemple.com"
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Montant demandé</span>
                          <span>{withdrawAmount ? `${withdrawAmount} FCFA` : "0 FCFA"}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span>Frais de transaction</span>
                          <span>50 FCFA</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-medium">
                          <span>Total à recevoir</span>
                          <span>{withdrawAmount ? `${Number(withdrawAmount) - 50} FCFA` : "0 FCFA"}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleWithdraw} 
                        className="w-full"
                        disabled={isSubmitting || balance <= 0}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Traitement...
                          </>
                        ) : (
                          "Demander le retrait"
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        Les retraits sont généralement traités sous 24 à 48 heures ouvrables.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Withdrawal Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Solde disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Dernière mise à jour: {new Date().toLocaleString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full"
                        onClick={fetchFinancialData}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            Actualisation...
                          </>
                        ) : (
                          "Actualiser le solde"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Retraits récents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-0">
                      {isLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <>
                          {transactions
                            .filter(tx => tx.transaction_type === 'withdrawal')
                            .slice(0, 3)
                            .map(withdrawal => (
                              <div key={withdrawal.id} className="px-6 py-3 border-b">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                                    <p className="text-xs text-gray-500">{formatDate(withdrawal.created_at)}</p>
                                  </div>
                                  <Badge variant="outline" className={`
                                    ${withdrawal.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                      withdrawal.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      'bg-red-50 text-red-700 border-red-200'}`
                                  }>
                                    {withdrawal.status === 'completed' ? 'Complété' :
                                      withdrawal.status === 'pending' ? 'En cours' :
                                      'Échoué'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            
                          {transactions.filter(tx => tx.transaction_type === 'withdrawal').length === 0 && (
                            <div className="px-6 py-6 text-center text-gray-500">
                              Aucun retrait récent
                            </div>
                          )}
                            
                          <div className="p-3 flex justify-center">
                            <Button variant="ghost" size="sm" className="text-xs w-full" onClick={() => document.querySelector('[data-state="inactive"][data-value="history"]')?.click()}>
                              Voir tout l'historique
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Payment Methods */}
            <TabsContent value="methods" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" /> 
                    Méthodes de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {/* Existing Methods */}
                      {paymentMethods.map(method => (
                        <div key={method.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center
                                ${method.type === 'momo' ? 'bg-yellow-100' :
                                  method.type === 'orange' ? 'bg-orange-100' :
                                  method.type === 'paypal' ? 'bg-blue-100' :
                                  'bg-gray-100'}`
                              }>
                                <CreditCard className={`h-5 w-5 
                                  ${method.type === 'momo' ? 'text-yellow-500' :
                                    method.type === 'orange' ? 'text-orange-500' :
                                    method.type === 'paypal' ? 'text-blue-500' :
                                    'text-gray-500'}`
                                } />
                              </div>
                              <div>
                                <h3 className="font-medium">{
                                  method.type === 'momo' ? 'MTN Mobile Money' :
                                  method.type === 'orange' ? 'Orange Money' :
                                  method.type === 'paypal' ? 'PayPal' :
                                  method.type === 'bank' ? 'Virement bancaire' :
                                  'Autre méthode'
                                }</h3>
                                <p className="text-sm text-gray-500">{method.name}</p>
                              </div>
                            </div>
                            {method.is_default ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Par défaut
                              </Badge>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultMethod(method.id)}
                              >
                                Définir par défaut
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Numéro / Identifiant</p>
                              <div className="flex gap-3 items-center mt-1">
                                <p className="text-gray-600">{method.account_number}</p>
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                  Modifier
                                </Button>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Nom du compte</p>
                              <div className="flex gap-3 items-center mt-1">
                                <p className="text-gray-600">{method.name}</p>
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add New Method */}
                      <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 py-8">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <PlusCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="font-medium">Ajouter une nouvelle méthode</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Ajoutez PayPal, carte bancaire, ou d'autres méthodes de paiement
                        </p>
                        <Button variant="outline" className="mt-2">
                          Ajouter une méthode
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Payment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> 
                    Paramètres de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Seuil minimum de retrait</p>
                      <p className="text-sm text-gray-500">Montant minimum requis pour demander un retrait</p>
                    </div>
                    <p className="font-medium">1 000 FCFA</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Délai de traitement</p>
                      <p className="text-sm text-gray-500">Délai moyen pour recevoir vos fonds</p>
                    </div>
                    <p className="font-medium">24-48 heures</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Devise des paiements</p>
                      <p className="text-sm text-gray-500">La devise dans laquelle vous êtes payé</p>
                    </div>
                    <p className="font-medium">FCFA</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Retraits automatiques</p>
                      <p className="text-sm text-gray-500">Retirez automatiquement vos gains à intervalles réguliers</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tax and Compliance */}
            <TabsContent value="tax" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> 
                    Fiscalité et conformité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tax Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Informations fiscales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom complet</label>
                        <Input placeholder="Votre nom" defaultValue={user?.user_metadata?.full_name || ''} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Numéro d'identification fiscale</label>
                        <Input placeholder="NIF / Numéro fiscal" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <Input placeholder="Votre adresse" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ville / Pays</label>
                        <Input placeholder="Ville et pays" />
                      </div>
                    </div>
                    <Button className="mt-2">
                      Enregistrer les informations
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Tax Documents */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Documents fiscaux</h3>
                    <p className="text-sm text-gray-500">
                      Téléchargez vos documents fiscaux pour vos déclarations. Les documents sont disponibles après la fin de l'année fiscale.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Relevé fiscal 2024</p>
                            <p className="text-xs text-gray-500">Disponible le 15 janvier 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4 mr-2" /> Télécharger
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Relevé fiscal 2023</p>
                            <p className="text-xs text-gray-500">Publié le 15 janvier 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Tax Assistance */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Assistance fiscale</h3>
                    <p className="text-sm text-gray-500">
                      Si vous avez des questions concernant vos obligations fiscales, notre équipe est disponible pour vous aider.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                      <p className="text-sm">
                        Vous êtes responsable de déclarer vos revenus selon les lois fiscales de votre pays de résidence.
                      </p>
                    </div>
                    <Button variant="outline">
                      Contacter l'assistance fiscale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Payments;
