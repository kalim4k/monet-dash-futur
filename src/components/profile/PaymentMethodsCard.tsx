
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodsCardProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export function PaymentMethodsCard({ paymentMethod, setPaymentMethod }: PaymentMethodsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Méthodes de Paiement</CardTitle>
        <CardDescription>Choisissez comment recevoir vos gains</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          defaultValue={paymentMethod} 
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
            <RadioGroupItem value="momo" id="momo" />
            <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-[#FFCB05] flex items-center justify-center text-black font-bold">
                M
              </div>
              <span>MTN Mobile Money</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
            <RadioGroupItem value="orange" id="orange" />
            <Label htmlFor="orange" className="flex-1 cursor-pointer flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-[#FF6600] flex items-center justify-center text-white font-bold">
                O
              </div>
              <span>Orange Money</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex-1 cursor-pointer flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-[#0070BA] flex items-center justify-center text-white font-bold">
                P
              </div>
              <span>PayPal</span>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
