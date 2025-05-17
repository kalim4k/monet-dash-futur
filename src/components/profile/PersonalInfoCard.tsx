
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Save } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface PersonalInfoCardProps {
  user: User | null;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  phone: string;
  setPhone: (value: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export function PersonalInfoCard({
  user,
  fullName,
  setFullName,
  email,
  phone,
  setPhone,
  avatarUrl,
  setAvatarUrl,
  isLoading,
  setIsLoading
}: PersonalInfoCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const { toast } = useToast();

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

  return (
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
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              Chargement...
            </div>
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
  );
}
