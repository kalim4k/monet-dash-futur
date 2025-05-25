
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Smartphone, TrendingUp, Users } from "lucide-react";

const EarningsCallToAction = () => {
  const handleSignUp = () => {
    window.open("/auth", "_blank");
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-lg mx-auto max-w-4xl my-8">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold">
            💰 OPPORTUNITÉ UNIQUE
          </Badge>
          
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Gagnez de l'argent avec votre compte WhatsApp !
          </h3>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Rejoignez des milliers d'africains qui gagnent déjà <span className="font-bold text-green-600">jusqu'à 50 000 FCFA par mois</span> en partageant simplement nos produits sur WhatsApp et les réseaux sociaux.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Simple & Rapide</h4>
              <p className="text-sm text-gray-600 text-center">Partagez sur WhatsApp, Facebook, Instagram</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">10 FCFA par clic</h4>
              <p className="text-sm text-gray-600 text-center">Gagnez pour chaque personne qui clique</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Retraits dès 1000 FCFA</h4>
              <p className="text-sm text-gray-600 text-center">Via Orange Money, MTN, PayPal</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Déjà rejoints par :</span>
            </div>
            <p className="text-2xl font-bold text-green-600">2,847 affiliés actifs</p>
            <p className="text-xs text-gray-500">qui gagnent de l'argent chaque jour</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              🚀 COMMENCER À GAGNER MAINTENANT
            </Button>
            
            <p className="text-xs text-gray-500">
              ✅ Inscription gratuite • ✅ Aucun investissement requis • ✅ Paiements garantis
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsCallToAction;
