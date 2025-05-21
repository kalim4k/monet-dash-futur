
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Bell, 
  Globe, 
  Layout, 
  Shield, 
  Smartphone, 
  Eye, 
  Activity, 
  Clock, 
  Calendar, 
  DollarSign, 
  Ruler, 
  LayoutDashboard, 
  BarChartBig, 
  Download, 
  ChevronRight 
} from "lucide-react";

const Settings = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("fr");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
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
                  Configuration
                </h1>
                {!isMobile && (
                  <p className="text-muted-foreground text-sm mt-1">
                    Personnalisez vos paramètres et préférences
                  </p>
                )}
              </div>
            </div>
          </header>
          
          {/* Settings Content */}
          <Tabs defaultValue="interface" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-8 w-full md:w-auto">
              <TabsTrigger value="interface" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Palette className="h-5 w-5" />
                <span className="hidden sm:inline">Interface</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Shield className="h-5 w-5" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Clock className="h-5 w-5" />
                <span className="hidden sm:inline">Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Interface Settings */}
            <TabsContent value="interface" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" /> 
                    Interface & Personnalisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Theme */}
                      <div className="space-y-2">
                        <Label htmlFor="theme">Thème</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Sélectionner un thème" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Clair</SelectItem>
                            <SelectItem value="dark">Sombre</SelectItem>
                            <SelectItem value="system">Système</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Language */}
                      <div className="space-y-2">
                        <Label htmlFor="language">Langue</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Layout */}
                    <div className="space-y-2">
                      <Label>Disposition du tableau de bord</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                          <Layout className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Compact</p>
                            <p className="text-xs text-gray-500">Vue condensée</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer border-primary bg-primary/5">
                          <Layout className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Standard</p>
                            <p className="text-xs text-gray-500">Vue équilibrée</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                          <Layout className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Confort</p>
                            <p className="text-xs text-gray-500">Vue espacée</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notifications */}
                    <div className="space-y-3">
                      <Label>Notifications</Label>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notif" className="text-sm font-medium">Notifications par email</Label>
                            <p className="text-xs text-gray-500">Recevoir des mises à jour par email</p>
                          </div>
                          <Switch 
                            id="email-notif"
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="push-notif" className="text-sm font-medium">Notifications push</Label>
                            <p className="text-xs text-gray-500">Recevoir des alertes sur votre appareil</p>
                          </div>
                          <Switch 
                            id="push-notif"
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="marketing-notif" className="text-sm font-medium">Communications marketing</Label>
                            <p className="text-xs text-gray-500">Recevoir des promotions et offres</p>
                          </div>
                          <Switch 
                            id="marketing-notif"
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="security-notif" className="text-sm font-medium">Alertes de sécurité</Label>
                            <p className="text-xs text-gray-500">Notifications pour les activités suspectes</p>
                          </div>
                          <Switch 
                            id="security-notif"
                            checked={notifications.security}
                            onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> 
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Two Factor Authentication */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="2fa" className="text-sm font-medium">Authentification à deux facteurs</Label>
                          <p className="text-xs text-gray-500">Sécurisez votre compte avec une vérification supplémentaire</p>
                        </div>
                        <Switch 
                          id="2fa"
                          checked={twoFactor}
                          onCheckedChange={setTwoFactor}
                        />
                      </div>
                    </div>
                    
                    {/* Connected Devices */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Appareils connectés</Label>
                      <div className="space-y-2 border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">iPhone 13 Pro</p>
                              <p className="text-xs text-gray-500">Dernière connexion: Aujourd'hui à 10:45</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Déconnecter
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">MacBook Pro</p>
                              <p className="text-xs text-gray-500">Dernière connexion: Hier à 18:20</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Déconnecter
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir tous les appareils
                      </Button>
                    </div>
                    
                    {/* Privacy Settings */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Paramètres de confidentialité</Label>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="profile-visibility" className="text-sm font-medium">Visibilité du profil</Label>
                            <p className="text-xs text-gray-500">Qui peut voir votre profil d'affilié</p>
                          </div>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]" id="profile-visibility">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="friends">Amis seulement</SelectItem>
                              <SelectItem value="nobody">Personne</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="data-sharing" className="text-sm font-medium">Partage de données</Label>
                            <p className="text-xs text-gray-500">Autorisez le partage de vos performances</p>
                          </div>
                          <Switch id="data-sharing" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    {/* Activity Log */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Journal d'activité</Label>
                        <Button variant="outline" size="sm">
                          Exporter <Download className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 border rounded-md p-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <p>Connexion réussie</p>
                            <p className="text-gray-500">Aujourd'hui, 10:45</p>
                          </div>
                          <p className="text-xs text-gray-500">IP: 192.168.1.1 • Navigateur: Chrome</p>
                        </div>
                        
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-sm">
                            <p>Mot de passe modifié</p>
                            <p className="text-gray-500">13 mai 2023, 15:30</p>
                          </div>
                          <p className="text-xs text-gray-500">IP: 192.168.1.1 • Navigateur: Chrome</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Voir l'historique complet <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" /> 
                    Préférences utilisateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Timezone */}
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Fuseau horaire</Label>
                        <Select defaultValue="europe_paris">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Sélectionner un fuseau horaire" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe_paris">Europe/Paris (GMT+1)</SelectItem>
                            <SelectItem value="america_new_york">America/New_York (GMT-5)</SelectItem>
                            <SelectItem value="asia_tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Date Format */}
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Format de date</Label>
                        <Select defaultValue="dd_mm_yyyy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Sélectionner un format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Currency */}
                      <div className="space-y-2">
                        <Label htmlFor="currency">Devise par défaut</Label>
                        <Select defaultValue="fcfa">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fcfa">FCFA</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Number Format */}
                      <div className="space-y-2">
                        <Label htmlFor="number-format">Format des nombres</Label>
                        <Select defaultValue="space">
                          <SelectTrigger id="number-format">
                            <SelectValue placeholder="Sélectionner un format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="space">1 000,00</SelectItem>
                            <SelectItem value="comma">1,000.00</SelectItem>
                            <SelectItem value="dot">1.000,00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Startup View */}
                    <div className="space-y-2">
                      <Label htmlFor="startup-view">Vue au démarrage</Label>
                      <Select defaultValue="dashboard">
                        <SelectTrigger id="startup-view">
                          <SelectValue placeholder="Sélectionner une vue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Tableau de bord</SelectItem>
                          <SelectItem value="products">Produits</SelectItem>
                          <SelectItem value="history">Historique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Email Preferences */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Préférences d'email</Label>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-digest" className="text-sm font-medium">Résumé hebdomadaire</Label>
                            <p className="text-xs text-gray-500">Recevoir un résumé des activités</p>
                          </div>
                          <Switch id="email-digest" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="performance-alerts" className="text-sm font-medium">Alertes de performance</Label>
                            <p className="text-xs text-gray-500">Notifications pour les changements de performance</p>
                          </div>
                          <Switch id="performance-alerts" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Dashboard Settings */}
            <TabsContent value="dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" /> 
                    Configuration du tableau de bord
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Widgets */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Widgets visibles</Label>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <p className="text-sm">Résumé des gains</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BarChartBig className="h-5 w-5 text-gray-500" />
                            <p className="text-sm">Clics par produit</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5 text-gray-500" />
                            <p className="text-sm">Gains hebdomadaires</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <p className="text-sm">Top affiliés</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    {/* Chart Preferences */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Préférences de graphiques</Label>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="animation" className="text-sm font-medium">Animation des graphiques</Label>
                            <p className="text-xs text-gray-500">Activer les animations des visualisations</p>
                          </div>
                          <Switch id="animation" defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="chart-colors">Palette de couleurs</Label>
                          <Select defaultValue="default">
                            <SelectTrigger id="chart-colors">
                              <SelectValue placeholder="Sélectionner une palette" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Par défaut</SelectItem>
                              <SelectItem value="monochrome">Monochrome</SelectItem>
                              <SelectItem value="pastel">Pastel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Export Preferences */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Préférences d'exportation</Label>
                      <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="export-format">Format d'exportation par défaut</Label>
                          <Select defaultValue="csv">
                            <SelectTrigger id="export-format">
                              <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="px-8">
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
