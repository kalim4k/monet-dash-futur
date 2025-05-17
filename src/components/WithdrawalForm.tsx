
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, Wallet } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const MIN_WITHDRAWAL = 50000;

// Define withdrawal form schema
const withdrawalSchema = z.object({
  method: z.string().min(1, "Veuillez sélectionner une méthode de paiement"),
  account: z.string().min(1, "Veuillez sélectionner un compte"),
  amount: z
    .number()
    .min(MIN_WITHDRAWAL, `Le montant minimum de retrait est de ${MIN_WITHDRAWAL.toLocaleString()} FCFA`)
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
  balance: number; // User's current available balance
  savedMethods: {
    id: string;
    type: "momo" | "orange" | "paypal";
    accounts: PaymentAccount[];
  }[];
  onSubmit: (data: WithdrawalFormValues) => void;
}

export function WithdrawalForm({ balance, savedMethods, onSubmit }: WithdrawalFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(
    savedMethods.length > 0 ? savedMethods[0].type : ""
  );
  const [amountError, setAmountError] = useState<string | null>(null);
  
  const accounts = savedMethods
    .find(method => method.type === selectedMethod)?.accounts || [];

  // Format currency in FCFA
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
      method: savedMethods.length > 0 ? savedMethods[0].type : "",
      account: accounts.length > 0 ? accounts[0].id : "",
      amount: 0,
    },
  });

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    form.setValue("method", value);
    
    // Reset account when method changes
    const newAccounts = savedMethods.find(method => method.type === value)?.accounts || [];
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
    
    if (values.amount < MIN_WITHDRAWAL) {
      setAmountError(`Le montant minimum de retrait est de ${MIN_WITHDRAWAL.toLocaleString()} FCFA`);
      return;
    }
    
    setAmountError(null);
    onSubmit(values);
    
    toast({
      title: "Demande de retrait envoyée",
      description: `Votre demande de retrait de ${formatCurrency(values.amount)} a été enregistrée et est en cours de traitement.`,
    });
    
    // Reset form
    form.reset({
      method: selectedMethod,
      account: form.getValues("account"),
      amount: 0,
    });
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
                      {savedMethods.map((method) => (
                        <SelectItem key={method.type} value={method.type}>
                          {method.type === "momo" && "MTN Mobile Money"}
                          {method.type === "orange" && "Orange Money"}
                          {method.type === "paypal" && "PayPal"}
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
                        min={MIN_WITHDRAWAL}
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
                <span className="font-medium">{formatCurrency(MIN_WITHDRAWAL)}</span>
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
                disabled={balance < MIN_WITHDRAWAL}
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
