
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Définir les paliers de retrait
const WITHDRAWAL_TIERS = {
  FIRST: 1000,
  SECOND: 15000,
  THIRD: 50000
};

// Définir le schéma de validation du formulaire de retrait
const withdrawalSchema = z.object({
  method: z.string().min(1, "Veuillez sélectionner une méthode de paiement"),
  account: z.string().min(1, "Veuillez sélectionner un compte"),
  amount: z
    .number()
    .min(WITHDRAWAL_TIERS.FIRST, `Le montant minimum de retrait est de ${WITHDRAWAL_TIERS.FIRST.toLocaleString()} FCFA`)
    .max(10000000, "Le montant maximum de retrait est de 10,000,000 FCFA"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

interface PaymentAccount {
  id: string;
  type: string;
  number: string;
  name: string;
}

interface WithdrawalFormProps {
  balance: number; // Solde disponible de l'utilisateur
  savedMethods: {
    id: string;
    type: "momo" | "orange" | "paypal" | "wave" | "moov" | "yass";
    accounts: PaymentAccount[];
  }[];
  onSubmit: (data: WithdrawalFormValues) => void;
  withdrawalCount?: number; // Nombre de retraits déjà effectués
}

export function WithdrawalForm({ balance, savedMethods, onSubmit, withdrawalCount = 0 }: WithdrawalFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amountError, setAmountError] = useState<string | null>(null);
  
  // Déterminer le palier actuel en fonction du nombre de retraits
  const getCurrentTier = () => {
    if (withdrawalCount === 0) return WITHDRAWAL_TIERS.FIRST;
    if (withdrawalCount === 1) return WITHDRAWAL_TIERS.SECOND;
    return WITHDRAWAL_TIERS.THIRD;
  };
  
  const minWithdrawal = getCurrentTier();
  
  // Déterminer quelles méthodes de paiement sont disponibles en fonction du palier
  const getAvailableMethods = () => {
    if (withdrawalCount === 0) {
      // Premier retrait: PayPal uniquement
      return savedMethods.filter(method => method.type === "paypal");
    } else {
      // 2ème et 3ème retraits: toutes les méthodes
      return savedMethods;
    }
  };
  
  const availableMethods = getAvailableMethods();
  
  // Sélectionner automatiquement la première méthode disponible
  useEffect(() => {
    if (availableMethods.length > 0 && !selectedMethod) {
      setSelectedMethod(availableMethods[0].type);
      form.setValue("method", availableMethods[0].type);
      
      const accounts = availableMethods[0].accounts;
      if (accounts && accounts.length > 0) {
        form.setValue("account", accounts[0].id);
      }
    }
  }, [availableMethods]);
  
  const accounts = availableMethods
    .find(method => method.type === selectedMethod)?.accounts || [];

  // Formater la devise en FCFA
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      method: availableMethods.length > 0 ? availableMethods[0].type : "",
      account: accounts.length > 0 ? accounts[0].id : "",
      amount: 0,
    },
  });

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    form.setValue("method", value);
    
    // Réinitialiser le compte lors du changement de méthode
    const newAccounts = availableMethods.find(method => method.type === value)?.accounts || [];
    if (newAccounts.length > 0) {
      form.setValue("account", newAccounts[0].id);
    } else {
      form.setValue("account", "");
    }
  };

  const handleSubmitForm = (values: WithdrawalFormValues) => {
    if (values.amount > balance) {
      setAmountError("Le montant demandé dépasse votre solde disponible");
      return;
    }
    
    if (values.amount < minWithdrawal) {
      setAmountError(`Le montant minimum de retrait est de ${minWithdrawal.toLocaleString()} FCFA pour ce palier`);
      return;
    }
    
    setAmountError(null);
    onSubmit(values);
    
    toast({
      title: "Demande de retrait envoyée",
      description: `Votre demande de retrait de ${formatCurrency(values.amount)} a été enregistrée et est en cours de traitement.`,
    });
    
    // Réinitialiser le formulaire
    form.reset({
      method: selectedMethod,
      account: form.getValues("account"),
      amount: 0,
    });
  };
  
  // Obtenir l'URL du logo en fonction du type de méthode
  const getMethodLogo = (type: string) => {
    switch (type) {
      case "momo": return "https://celinaroom.com/wp-content/uploads/2025/01/mtn-1-Copie.jpg";
      case "orange": return "https://celinaroom.com/wp-content/uploads/2025/01/Orange-Money-recrute-pour-ce-poste-22-Mars-2023.png";
      case "paypal": return "https://celinaroom.com/wp-content/uploads/2025/01/ENIGME3.png";
      case "wave": return "https://celinaroom.com/wp-content/uploads/2025/02/Design-sans-titre4.png";
      case "moov": return "https://celinaroom.com/wp-content/uploads/2025/01/Moov_Money_Flooz.png";
      case "yass": return "https://celinaroom.com/wp-content/uploads/2025/05/mixx-by-yas.jpg";
      default: return "";
    }
  };
  
  // Obtenir le nom complet de la méthode de paiement
  const getMethodName = (type: string) => {
    switch (type) {
      case "momo": return "MTN Mobile Money";
      case "orange": return "Orange Money";
      case "paypal": return "PayPal";
      case "wave": return "Wave";
      case "moov": return "Moov Money";
      case "yass": return "Yass";
      default: return type;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Faire un retrait</CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Solde disponible</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
            {/* Alerte sur le palier actuel */}
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm">
                Vous êtes au {withdrawalCount === 0 ? "premier" : withdrawalCount === 1 ? "deuxième" : "troisième"} palier de retrait.
                Montant minimum: {formatCurrency(minWithdrawal)}
                {withdrawalCount === 0 && " (PayPal uniquement)"}
              </AlertDescription>
            </Alert>
            
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select 
                    value={field.value}
                    onValueChange={(value) => handleMethodChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une méthode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableMethods.map((method) => (
                        <SelectItem key={method.type} value={method.type} className="flex items-center">
                          <div className="flex items-center gap-2">
                            {method.type && (
                              <img 
                                src={getMethodLogo(method.type)} 
                                alt={getMethodName(method.type)} 
                                className="h-5 w-5 object-contain" 
                              />
                            )}
                            {getMethodName(method.type)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compte de retrait</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={accounts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un compte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.number} ({account.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant du retrait</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={minWithdrawal}
                        max={balance}
                        className="pr-16"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        FCFA
                      </div>
                    </div>
                  </FormControl>
                  {amountError && <p className="text-sm font-medium text-destructive mt-1">{amountError}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-muted-foreground">Montant minimum</span>
                <span className="font-medium">{formatCurrency(minWithdrawal)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frais de retrait</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
            </div>

            <CardFooter className="px-0 pt-2 pb-0 flex justify-end">
              <Button 
                type="submit" 
                className="w-full sm:w-auto gap-2"
                disabled={balance < minWithdrawal}
              >
                <ArrowDown className="h-4 w-4" />
                <span>Demander le retrait</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
