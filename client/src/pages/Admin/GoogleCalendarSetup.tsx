import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Page d'administration pour configurer Google Calendar
 * 
 * Cette page permet à Olivier d'autoriser l'accès à son Google Calendar
 * pour activer la synchronisation automatique des rendez-vous.
 * 
 * IMPORTANT : Cette page doit être visitée UNE SEULE FOIS pour autoriser l'accès.
 * Après cela, tous les rendez-vous seront automatiquement synchronisés.
 */
export default function GoogleCalendarSetup() {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Gérer le retour du callback OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      toast.error("Autorisation refusée", {
        description: "Vous devez autoriser l'accès pour activer la synchronisation Google Calendar."
      });
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/admin/google-calendar-setup');
      return;
    }

    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    setIsProcessingCallback(true);
    
    try {
      // Envoyer le code au backend pour sauvegarder les tokens
      const response = await fetch('/api/calendar/save-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des tokens');
      }

      toast.success("Google Calendar activé !", {
        description: "Les rendez-vous seront maintenant automatiquement ajoutés à votre calendrier.",
        duration: 5000,
      });

      // Nettoyer l'URL
      window.history.replaceState({}, '', '/admin/google-calendar-setup');
      
      // Afficher un message de succès permanent
      setTimeout(() => {
        setIsProcessingCallback(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur OAuth callback:', error);
      toast.error("Erreur d'autorisation", {
        description: "Une erreur est survenue lors de l'activation. Veuillez réessayer."
      });
      setIsProcessingCallback(false);
    }
  };

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    
    // Rediriger directement vers l'endpoint backend qui génère l'URL OAuth
    window.location.href = '/api/calendar/auth';
  };

  if (isProcessingCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Activation en cours...</p>
              <p className="text-sm text-muted-foreground text-center">
                Nous configurons votre Google Calendar. Veuillez patienter.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl">Configuration Google Calendar</CardTitle>
          <CardDescription className="text-base mt-2">
            Activez la synchronisation automatique des rendez-vous clients
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avantages */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Ce que vous obtenez :
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Création automatique des événements dans votre Google Calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Invitations Google Meet envoyées automatiquement aux clients</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Rappels automatiques 24h et 30min avant chaque rendez-vous</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Synchronisation bidirectionnelle (modifications visibles partout)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Zéro intervention manuelle - tout est automatique</span>
              </li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Comment ça marche ?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <span>Cliquez sur "Autoriser l'accès" ci-dessous</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <span>Connectez-vous à votre compte Google (contact@winwin.swiss)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <span>Autorisez l'accès à votre calendrier</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                <span>C'est tout ! Les rendez-vous seront automatiquement synchronisés</span>
              </li>
            </ol>
          </div>

          {/* Sécurité */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-900 mb-2">🔒 Sécurité et confidentialité</p>
            <p>
              Vos identifiants Google ne sont jamais stockés. Seul un token d'accès sécurisé 
              est sauvegardé localement pour permettre la synchronisation. Vous pouvez révoquer 
              l'accès à tout moment depuis votre compte Google.
            </p>
          </div>

          {/* Bouton d'autorisation */}
          <Button
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isAuthorizing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirection vers Google...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-5 w-5" />
                Autoriser l'accès à Google Calendar
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            En cliquant sur ce bouton, vous serez redirigé vers Google pour autoriser l'accès.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
