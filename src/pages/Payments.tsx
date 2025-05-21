
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

const Payments = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  
  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez saisir un montant valide pour le retrait.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Demande de retrait envoyée",
      description: `Votre retrait de ${withdrawAmount} FCFA a été soumis et sera traité prochainement.`,
    });
    setWithdrawAmount("");
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
                      <h3 className="text-3xl font-bold mt-2">5 000 FCFA</h3>
                      <p className="text-xs text-green-600 mt-1">Prêt à être retiré</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm">
                      <p className="text-sm text-gray-500">Gains en attente</p>
                      <h3 className="text-3xl font-bold mt-2">1 250 FCFA</h3>
                      <p className="text-xs text-blue-600 mt-1">Disponible dans 3 jours</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm">
                      <p className="text-sm text-gray-500">Revenus totaux</p>
                      <h3 className="text-3xl font-bold mt-2">15 750 FCFA</h3>
                      <p className="text-xs text-purple-600 mt-1">Depuis le début</p>
                    </div>
                  </div>
                  
                  {/* Monthly Progress */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium">Objectif mensuel</h4>
                        <p className="text-sm text-gray-500">Mai 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">7 500 / 10 000 FCFA</p>
                        <p className="text-sm text-gray-500">75% atteint</p>
                      </div>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  {/* Recent Payments */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Paiements récents</h4>
                      <Button variant="outline" size="sm">
                        Voir tout
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">Paiement reçu</p>
                            <p className="text-xs text-gray-500">15 mai 2025</p>
                          </div>
                        </div>
                        <p className="font-medium">2 500 FCFA</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium">En traitement</p>
                            <p className="text-xs text-gray-500">12 mai 2025</p>
                          </div>
                        </div>
                        <p className="font-medium">1 750 FCFA</p>
                      </div>
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
                      <h3 className="text-2xl font-bold mt-1">6 250 FCFA</h3>
                      <p className="text-xs text-green-600 mt-1">↑ 12% vs mois précédent</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">Revenus par clic</p>
                      <h3 className="text-2xl font-bold mt-1">1.0 FCFA</h3>
                      <p className="text-xs text-gray-500 mt-1">Taux standard</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">Prochaine date de paiement</p>
                      <h3 className="text-2xl font-bold mt-1">28 mai 2025</h3>
                      <p className="text-xs text-blue-600 mt-1">Dans 12 jours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium">Paiement reçu</p>
                          <p className="text-xs text-gray-500">#TRX-12345</p>
                        </div>
                        <div className="flex items-center">
                          <p>15 mai 2025</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complété</Badge>
                        </div>
                        <div className="text-right font-medium text-green-600">+2 500 FCFA</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium">Retrait vers Mobile Money</p>
                          <p className="text-xs text-gray-500">#WD-45678</p>
                        </div>
                        <div className="flex items-center">
                          <p>10 mai 2025</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En cours</Badge>
                        </div>
                        <div className="text-right font-medium text-red-600">-1 500 FCFA</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium">Bonus programme d'affiliation</p>
                          <p className="text-xs text-gray-500">#BNS-89012</p>
                        </div>
                        <div className="flex items-center">
                          <p>5 mai 2025</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complété</Badge>
                        </div>
                        <div className="text-right font-medium text-green-600">+500 FCFA</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium">Paiement reçu</p>
                          <p className="text-xs text-gray-500">#TRX-23456</p>
                        </div>
                        <div className="flex items-center">
                          <p>28 avr 2025</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complété</Badge>
                        </div>
                        <div className="text-right font-medium text-green-600">+1 750 FCFA</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium">Retrait vers Mobile Money</p>
                          <p className="text-xs text-gray-500">#WD-67890</p>
                        </div>
                        <div className="flex items-center">
                          <p>20 avr 2025</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complété</Badge>
                        </div>
                        <div className="text-right font-medium text-red-600">-3 000 FCFA</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Affichage de 1-5 sur 24 transactions</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>Précédent</Button>
                      <Button variant="outline" size="sm">Suivant</Button>
                    </div>
                  </div>
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
                          />
                        </div>
                        <p className="text-xs text-gray-500">Minimum: 1 000 FCFA | Maximum: 500 000 FCFA</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Méthode de paiement</label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momo">Mobile Money</SelectItem>
                            <SelectItem value="bank">Virement bancaire</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {paymentMethod === "momo" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro Mobile Money</label>
                          <Input placeholder="Exemple: 97 12 34 56" />
                        </div>
                      )}
                      
                      {paymentMethod === "bank" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">IBAN</label>
                          <Input placeholder="FRXX XXXX XXXX XXXX XXXX XXXX XXX" />
                        </div>
                      )}
                      
                      {paymentMethod === "paypal" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email PayPal</label>
                          <Input placeholder="votre-email@exemple.com" />
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
                      
                      <Button onClick={handleWithdraw} className="w-full">
                        Demander le retrait
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
                      <h3 className="text-3xl font-bold">5 000 FCFA</h3>
                      <p className="text-sm text-gray-500 mt-1">Dernière mise à jour: Aujourd'hui à 10:45</p>
                      <Button variant="outline" className="mt-4 w-full">
                        Actualiser le solde
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Retraits récents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-0">
                      <div className="px-6 py-3 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">1 500 FCFA</p>
                            <p className="text-xs text-gray-500">10 mai 2025</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            En cours
                          </Badge>
                        </div>
                      </div>
                      <div className="px-6 py-3 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">3 000 FCFA</p>
                            <p className="text-xs text-gray-500">20 avr 2025</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Complété
                          </Badge>
                        </div>
                      </div>
                      <div className="px-6 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">2 500 FCFA</p>
                            <p className="text-xs text-gray-500">5 avr 2025</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Complété
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 flex justify-center">
                        <Button variant="ghost" size="sm" className="text-xs w-full">
                          Voir tout l'historique
                        </Button>
                      </div>
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
                  {/* Mobile Money */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Mobile Money</h3>
                          <p className="text-sm text-gray-500">Orange Money, MTN Mobile Money, etc.</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Par défaut
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Numéro</p>
                        <div className="flex gap-3 items-center mt-1">
                          <p className="text-gray-600">+XXX XX XX XX XX</p>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Modifier
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Opérateur</p>
                        <div className="flex gap-3 items-center mt-1">
                          <p className="text-gray-600">Orange Money</p>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bank Transfer */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Virement bancaire</h3>
                          <p className="text-sm text-gray-500">Virement vers votre compte en banque</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Définir par défaut
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Banque</p>
                        <div className="flex gap-3 items-center mt-1">
                          <p className="text-gray-600">Banque Atlantique</p>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Modifier
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">IBAN</p>
                        <div className="flex gap-3 items-center mt-1">
                          <p className="text-gray-600">XXXX XXXX XXXX XXXX XXXX</p>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
                        <Input placeholder="Votre nom" />
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
