
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";

export function SocialNetworksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réseaux Sociaux</CardTitle>
        <CardDescription>Suivez-nous sur nos réseaux sociaux</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0088cc] flex items-center justify-center">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Twitter</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Rejoignez notre communauté Twitter pour recevoir des offres exclusives et les dernières nouvelles
              </CardDescription>
              <Button className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90">
                S'abonner
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                  {/* Using a custom icon for TikTok */}
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <CardTitle>TikTok</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Suivez-nous sur TikTok pour découvrir nos vidéos et tutoriels
              </CardDescription>
              <Button className="w-full bg-black hover:bg-black/90">
                Suivre
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
