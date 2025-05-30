
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  userId: string;
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
}

export function ImageUploader({ userId, currentImageUrl, onImageUploaded }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize preview with current image
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 2 Mo",
        variant: "destructive",
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    try {
      setIsUploading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Delete old avatar if exists
      if (currentImageUrl) {
        try {
          const urlParts = currentImageUrl.split('/');
          // Look for userId in the path to extract the correct part
          let oldFilePath = '';
          for (let i = 0; i < urlParts.length; i++) {
            if (urlParts[i] === 'avatars' && i + 2 < urlParts.length) {
              oldFilePath = `${urlParts[i+1]}/${urlParts[i+2]}`;
              break;
            }
          }
          
          if (oldFilePath) {
            console.log(`Attempting to delete old avatar: ${oldFilePath}`);
            await supabase.storage
              .from('avatars')
              .remove([oldFilePath]);
          }
        } catch (error) {
          console.log("Failed to delete old avatar:", error);
          // Continue even if deletion fails
        }
      }

      // Upload the new file
      console.log(`Uploading new avatar to: ${filePath}`);
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get the public URL
      const publicUrl = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath).data.publicUrl;
      
      console.log(`Avatar uploaded successfully, public URL: ${publicUrl}`);
      
      // Update user profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }
      
      onImageUploaded(publicUrl);
      
      toast({
        title: "Image téléchargée",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error: any) {
      console.error("Erreur de téléchargement:", error);
      toast({
        title: "Échec du téléchargement",
        description: error.message || "Une erreur est survenue lors du téléchargement de l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!currentImageUrl) {
      setPreviewUrl(null);
      onImageUploaded("");
      return;
    }

    try {
      setIsUploading(true);
      
      // Extract file path from URL
      const urlParts = currentImageUrl.split('/');
      // Look for userId in the path to extract the correct part
      let filePath = '';
      for (let i = 0; i < urlParts.length; i++) {
        if (urlParts[i] === 'avatars' && i + 2 < urlParts.length) {
          filePath = `${urlParts[i+1]}/${urlParts[i+2]}`;
          break;
        }
      }
      
      if (filePath) {
        console.log(`Removing image: ${filePath}`);
        await supabase.storage
          .from('avatars')
          .remove([filePath]);
      }
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      setPreviewUrl(null);
      onImageUploaded("");
      
      toast({
        title: "Image supprimée",
        description: "Votre photo de profil a été supprimée",
      });
    } catch (error: any) {
      console.error("Erreur de suppression:", error);
      toast({
        title: "Échec de la suppression",
        description: error.message || "Une erreur est survenue lors de la suppression de l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Aperçu" 
            className="h-40 w-40 object-cover rounded-full border-4 border-primary/20"
          />
          <Button 
            size="icon"
            variant="destructive" 
            className="absolute -top-2 -right-2 rounded-full" 
            onClick={removeImage}
            disabled={isUploading}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
          <Upload size={40} className="text-muted-foreground" />
        </div>
      )}

      <Input 
        type="file" 
        id="avatar" 
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Button 
        variant="outline" 
        className="relative"
        disabled={isUploading}
        onClick={() => document.getElementById("avatar")?.click()}
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Téléchargement...
          </span>
        ) : (
          "Changer la photo"
        )}
      </Button>
    </div>
  );
}
