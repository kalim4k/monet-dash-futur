
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UserSettings {
  id?: string;
  user_id?: string;
  notification_email?: boolean;
  notification_app?: boolean;
  theme?: string;
  language?: string;
  dashboard_widgets?: {
    recentClicks?: boolean;
    earningsChart?: boolean;
    topAffiliates?: boolean;
    productPerformance?: boolean;
  };
  auto_withdrawal?: boolean;
  auto_withdrawal_threshold?: number;
  auto_withdrawal_method_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface SocialNetworksCardProps {
  userSettings: UserSettings | null;
  isLoading: boolean;
}

export const SocialNetworksCard = ({ userSettings, isLoading }: SocialNetworksCardProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(userSettings);
  const [saving, setSaving] = useState(false);

  // Handler to toggle notification settings
  const handleToggle = async (field: keyof UserSettings, value: boolean) => {
    if (!settings?.id) return;
    
    try {
      setSaving(true);
      
      // Update local state first for immediate feedback
      setSettings(prev => prev ? { ...prev, [field]: value } : null);
      
      // Update in database
      const { error } = await supabase
        .from('user_settings')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', settings.id);
      
      if (error) throw error;
      
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été enregistrées.",
      });
      
    } catch (error) {
      console.error("Error updating settings:", error);
      // Revert state on error
      setSettings(userSettings);
      
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos paramètres.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notifications</CardTitle>
        <CardDescription>Gérez comment et quand vous recevez des notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div>
            <h3 className="font-medium">Notifications par email</h3>
            <p className="text-sm text-muted-foreground">Recevez des notifications importantes par email</p>
          </div>
          <Switch 
            id="notification_email" 
            checked={settings?.notification_email || false} 
            onCheckedChange={(value) => handleToggle('notification_email', value)}
            disabled={isLoading || saving}
          />
        </div>
        
        {/* App Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div>
            <h3 className="font-medium">Notifications dans l'application</h3>
            <p className="text-sm text-muted-foreground">Recevez des notifications dans l'application</p>
          </div>
          <Switch
            id="notification_app"
            checked={settings?.notification_app || false}
            onCheckedChange={(value) => handleToggle('notification_app', value)}
            disabled={isLoading || saving}
          />
        </div>
        
        {/* Dashboard Widgets */}
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-4">Widgets du tableau de bord</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="widget_recent_clicks" 
                checked={settings?.dashboard_widgets?.recentClicks || false}
                disabled={isLoading || saving}
              />
              <Label htmlFor="widget_recent_clicks">Clics récents</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="widget_earnings_chart" 
                checked={settings?.dashboard_widgets?.earningsChart || false}
                disabled={isLoading || saving}
              />
              <Label htmlFor="widget_earnings_chart">Graphique des revenus</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="widget_top_affiliates" 
                checked={settings?.dashboard_widgets?.topAffiliates || false}
                disabled={isLoading || saving}
              />
              <Label htmlFor="widget_top_affiliates">Top affiliés</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="widget_product_performance" 
                checked={settings?.dashboard_widgets?.productPerformance || false}
                disabled={isLoading || saving}
              />
              <Label htmlFor="widget_product_performance">Performance des produits</Label>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="mt-4" disabled={isLoading || saving}>
            Restaurer les paramètres par défaut
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
