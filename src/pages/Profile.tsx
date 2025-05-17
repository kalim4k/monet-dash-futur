import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  CreditCard, 
  Bell, 
  Globe, 
  Lock, 
  Phone, 
  Mail,
  Edit,
  Settings,
  Twitter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const [language, setLanguage] = useState("fr");
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-6xl py-6 px-4 sm:px-6 space-y-8">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Votre Profil</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos informations personnelles et paramètres
            </p>
          </header>
          
          <Tabs defaultValue="user-info" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="user-info" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Profil Utilisateur</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <CreditCard className="h-5 w-5" />
                <span className="hidden sm:inline">Méthodes de Paiement</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Bell className="h-5 w-5" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
                <Settings className="h-5 w-5" />
                <span className="hidden sm:inline">Paramètres</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Section */}
            <TabsContent value="user-info">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Modifiez vos informations de profil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
                        <AvatarFallback className="bg-primary/20">
                          <User size={32} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="flex gap-2">
                          <Edit size={16} />
                          Modifier la photo
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG ou GIF. 2MB maximum.
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <div className="flex gap-2">
                        <Input id="name" defaultValue="Emma Dupont" />
                        <Button size="icon" variant="outline">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex gap-2">
                        <Input id="email" type="email" defaultValue="emma.dupont@example.com" />
                        <Button size="icon" variant="outline">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <div className="flex gap-2">
                        <Input id="phone" type="tel" defaultValue="+237 655 123 456" />
                        <Button size="icon" variant="outline">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Enregistrer les modifications</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Changer le mot de passe</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Payment Methods Section */}
            <TabsContent value="payment">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Méthodes de Paiement</CardTitle>
                    <CardDescription>Choisissez comment recevoir vos gains</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="momo" className="space-y-4">
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ajouter un nouveau compte</CardTitle>
                    <CardDescription>Entrez les coordonnées de votre compte de paiement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-type">Type de compte</Label>
                      <Select defaultValue="momo">
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
              </div>
            </TabsContent>
            
            {/* Notifications Section */}
            <TabsContent value="notifications">
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
            </TabsContent>
            
            {/* Settings Section */}
            <TabsContent value="settings">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Langue de l'application</CardTitle>
                    <CardDescription>Choisissez votre langue préférée</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      defaultValue={language} 
                      onValueChange={setLanguage}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                        <RadioGroupItem value="fr" id="fr" />
                        <Label htmlFor="fr" className="flex-1 cursor-pointer flex items-center gap-2">
                          <div className="h-5 w-8 rounded overflow-hidden flex-shrink-0">
                            <div className="flex h-full">
                              <div className="bg-blue-600 h-full w-1/3"></div>
                              <div className="bg-white h-full w-1/3"></div>
                              <div className="bg-red-600 h-full w-1/3"></div>
                            </div>
                          </div>
                          <span>Français</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                        <RadioGroupItem value="en" id="en" />
                        <Label htmlFor="en" className="flex-1 cursor-pointer flex items-center gap-2">
                          <div className="h-5 w-8 rounded overflow-hidden flex-shrink-0 bg-blue-800">
                            {/* Simple Union Jack representation */}
                            <div className="h-full w-full relative">
                              <div className="absolute inset-0 bg-white" 
                                   style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
                              <div className="absolute inset-0 bg-red-600" 
                                   style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%, 0 0)" }}></div>
                              <div className="absolute inset-0 bg-red-600" 
                                   style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%, 100% 0)" }}></div>
                            </div>
                          </div>
                          <span>English</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                  <CardFooter>
                    <Button>Appliquer</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de Notifications</CardTitle>
                    <CardDescription>Gérez vos préférences de notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications par email
                        </p>
                      </div>
                      <Switch defaultChecked id="email-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications push</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications sur votre appareil
                        </p>
                      </div>
                      <Switch id="push-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications marketing</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des offres promotionnelles
                        </p>
                      </div>
                      <Switch id="marketing-notifications" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Enregistrer les préférences</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
