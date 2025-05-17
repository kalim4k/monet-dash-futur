
import { useState, useEffect } from "react";
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
  Twitter,
  Loader2,
  Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUploader } from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [language, setLanguage] = useState("fr");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  
  // Current password states for security tab
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Load user profile on mount
  useEffect(() => {
    if (user) {
      // Set email from auth
      setEmail(user.email || "");
      
      // Get additional profile data from user metadata or profiles table
      const metadata = user.user_metadata || {};
      setFullName(metadata.full_name || "");
      setPhone(metadata.phone || "");
      setAvatarUrl(metadata.avatar_url || null);
      
      // Load profile from profiles table if needed
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Erreur chargement profil:", error);
        return;
      }
      
      if (data) {
        setFullName(data.full_name || user.user_metadata?.full_name || "");
        setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  
  const updateUserProfile = async (field: string, value: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Update in profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          [field]: value,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      // Also update metadata in auth.users
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { [field]: value }
      });
      
      if (metadataError) throw metadataError;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées",
      });
    } catch (error: any) {
      console.error("Erreur de mise à jour:", error);
      toast({
        title: "Échec de la mise à jour",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsEditingName(false);
      setIsEditingPhone(false);
    }
  };
  
  const handleImageUploaded = async (url: string) => {
    setAvatarUrl(url);
    if (user?.id) {
      await updateUserProfile('avatar_url', url);
    }
  };
  
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur de confirmation",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès",
      });
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Erreur de changement de mot de passe:", error);
      toast({
        title: "Échec de la mise à jour",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
            <TabsList className="grid grid-cols-3 mb-8">
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
                      {user?.id ? (
                        <ImageUploader 
                          userId={user.id}
                          currentImageUrl={avatarUrl}
                          onImageUploaded={handleImageUploaded}
                        />
                      ) : (
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                          <AvatarFallback className="bg-primary/20">
                            <User size={32} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <div className="flex gap-2">
                        {isEditingName ? (
                          <div className="flex flex-1 gap-2">
                            <Input 
                              id="name" 
                              value={fullName} 
                              onChange={(e) => setFullName(e.target.value)} 
                              disabled={isLoading}
                            />
                            <Button 
                              onClick={() => updateUserProfile('full_name', fullName)} 
                              disabled={isLoading} 
                              size="icon"
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input id="name" value={fullName} readOnly />
                            <Button 
                              size="icon" 
                              variant="outline" 
                              onClick={() => setIsEditingName(true)}
                            >
                              <Edit size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex gap-2">
                        <Input id="email" type="email" value={email} readOnly />
                        <Button size="icon" variant="outline" disabled title="L'email ne peut pas être modifié">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <div className="flex gap-2">
                        {isEditingPhone ? (
                          <div className="flex flex-1 gap-2">
                            <Input 
                              id="phone" 
                              type="tel" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)} 
                              disabled={isLoading}
                            />
                            <Button 
                              onClick={() => updateUserProfile('phone', phone)} 
                              disabled={isLoading} 
                              size="icon"
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input id="phone" type="tel" value={phone} readOnly />
                            <Button 
                              size="icon" 
                              variant="outline" 
                              onClick={() => setIsEditingPhone(true)}
                            >
                              <Edit size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={updatePassword} 
                      disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        "Changer le mot de passe"
                      )}
                    </Button>
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
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
