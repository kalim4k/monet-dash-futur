
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentAccountCardProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export function PaymentAccountCard({ paymentMethod, setPaymentMethod }: PaymentAccountCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleAddAccount = async () => {
    if (!user?.id || !accountNumber || !accountName) {
      toast({
        title: "Champs incomplets",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: paymentMethod,
          name: accountName,
          account_number: accountNumber,
          details: {
            address: address || null
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Reset form
      setAccountNumber("");
      setAccountName("");
      setAddress("");
      
      // Show success message
      toast({
        title: "Compte ajouté",
        description: "Votre compte de paiement a été ajouté avec succès.",
      });
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le compte de paiement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau compte</CardTitle>
        <CardDescription>Entrez les coordonnées de votre compte de paiement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment-type">Type de compte</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment-type">
              <SelectValue placeholder="Sélectionner un type de compte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momo">MTN Mobile Money</SelectItem>
              <SelectItem value="orange">Orange Money</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank">Compte bancaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-number">
            {paymentMethod === 'paypal' ? 'Email PayPal' : 
             paymentMethod === 'bank' ? 'IBAN / Numéro de compte' : 
             'Numéro de téléphone'}
          </Label>
          <Input 
            id="account-number" 
            placeholder={
              paymentMethod === 'paypal' ? 'votre-email@example.com' :
              paymentMethod === 'bank' ? 'FRXX XXXX XXXX XXXX XXXX XXXX XXX' :
              '+237 6XX XX XX XX'
            }
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-name">Nom associé au compte</Label>
          <Input 
            id="account-name" 
            placeholder="Nom et prénom" 
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse de paiement (optionnel)</Label>
          <Input 
            id="address" 
            placeholder="Votre adresse complète" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddAccount} 
          disabled={isSubmitting || !accountNumber || !accountName}
        >
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter ce compte'}
        </Button>
      </CardFooter>
    </Card>
  );
}
