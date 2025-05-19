
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ClickReviewTable } from "@/components/ClickReviewTable";

interface Click {
  id: string;
  clicked_at: string;
  is_valid: boolean | null;
  is_reviewed: boolean | null;
  affiliate_link_id: string | null;
  product_id: string | null;
  user_agent?: string;
  ip_address?: string;
}

const ClickReview = () => {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'valid' | 'invalid'>('pending');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Admin-only page
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user?.id) return;
        
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (error || data !== true) {
          // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    loadClicks();
  }, [user, statusFilter]);

  const loadClicks = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('clicks')
        .select('*')
        .order('clicked_at', { ascending: false });
        
      // Appliquer le filtre
      if (statusFilter === 'pending') {
        query = query.is('is_reviewed', false);
      } else if (statusFilter === 'valid') {
        query = query.eq('is_valid', true).eq('is_reviewed', true);
      } else if (statusFilter === 'invalid') {
        query = query.eq('is_valid', false).eq('is_reviewed', true);
      }
        
      // Limiter le résultat
      query = query.limit(100);
        
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setClicks(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Revue des Clics</h1>
            <p className="text-muted-foreground mt-1">
              Analysez et validez les clics pour éviter les fraudes
            </p>
          </header>
          
          <Tabs defaultValue="pending" className="mb-6" onValueChange={(value) => setStatusFilter(value as any)}>
            <TabsList>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="valid">Validés</TabsTrigger>
              <TabsTrigger value="invalid">Invalidés</TabsTrigger>
              <TabsTrigger value="all">Tous</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClickReviewTable clicks={clicks} onClickReviewed={loadClicks} />
          )}
          
          <div className="mt-6 flex justify-end">
            <Button onClick={loadClicks} variant="outline">
              Actualiser
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ClickReview;
