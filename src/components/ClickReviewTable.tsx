
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { reviewClick } from "@/services/trackingService";

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

interface ClickReviewTableProps {
  clicks: Click[];
  onClickReviewed?: () => void;
}

export function ClickReviewTable({ clicks, onClickReviewed }: ClickReviewTableProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleReviewClick = async (clickId: string, isValid: boolean) => {
    setProcessingIds(prev => new Set(prev).add(clickId));
    
    try {
      const result = await reviewClick(clickId, isValid);
      
      if (result.success) {
        toast({
          title: isValid ? "Clic validé" : "Clic invalidé",
          description: `Le clic a été marqué comme ${isValid ? 'valide' : 'invalide'}.`,
          variant: isValid ? "default" : "destructive"
        });
        
        // Callback pour rafraîchir les données
        if (onClickReviewed) {
          onClickReviewed();
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de réviser ce clic.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la révision du clic:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la révision du clic.",
        variant: "destructive"
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(clickId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (click: Click) => {
    if (click.is_reviewed === true) {
      return click.is_valid ? 
        <Badge className="bg-green-500 hover:bg-green-600">Validé</Badge> : 
        <Badge className="bg-red-500 hover:bg-red-600">Invalidé</Badge>;
    } else {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revue des Clics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit/Lien</TableHead>
              <TableHead>User Agent</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clicks.length > 0 ? (
              clicks.map((click) => (
                <TableRow key={click.id} className={!click.is_valid ? "bg-red-50" : ""}>
                  <TableCell>{format(new Date(click.clicked_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>
                    {click.affiliate_link_id ? 
                      `Lien d'affiliation: ${click.affiliate_link_id.substring(0, 8)}...` :
                      `Produit: ${click.product_id?.substring(0, 8)}...`
                    }
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{click.user_agent || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(click)}</TableCell>
                  <TableCell className="text-right">
                    {click.is_reviewed ? (
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-sm text-gray-500">Déjà révisé</span>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-green-600"
                          disabled={processingIds.has(click.id)}
                          onClick={() => handleReviewClick(click.id, true)}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600"
                          disabled={processingIds.has(click.id)}
                          onClick={() => handleReviewClick(click.id, false)}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Aucun clic à réviser pour le moment
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
