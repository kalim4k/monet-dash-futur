
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentAccountCardProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export function PaymentAccountCard({ paymentMethod, setPaymentMethod }: PaymentAccountCardProps) {
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
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-number">Numéro de compte / Email</Label>
          <Input id="account-number" placeholder="Ex: +237 655 123 456 ou email@example.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-name">Nom associé au compte</Label>
          <Input id="account-name" placeholder="Emma Dupont" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse de paiement</Label>
          <Input id="address" placeholder="Votre adresse complète" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Ajouter ce compte</Button>
      </CardFooter>
    </Card>
  );
}
