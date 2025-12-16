import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Mail, User, CheckCircle2 } from "lucide-react";

interface ReferralCodeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralCodeRequestDialog({ open, onOpenChange }: ReferralCodeRequestDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const requestCodeMutation = trpc.referral.requestCode.useMutation({
    onSuccess: () => {
      toast.success("Demande envoyée !", {
        description: "Nous vous enverrons votre code de parrainage par email sous 48h.",
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
      setFormData({ firstName: "", lastName: "", email: "" });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Champs manquants", {
        description: "Veuillez remplir tous les champs.",
      });
      return;
    }

    requestCodeMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Obtenir mon code de parrainage
          </DialogTitle>
          <DialogDescription className="text-base">
            Vous êtes déjà client WIN WIN Finance Group ? Obtenez votre code de parrainage personnel pour commencer à économiser !
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="lastName"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.ch"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Note :</strong> Nous vérifierons que vous êtes bien client WIN WIN Finance Group avant de vous envoyer votre code de parrainage par email.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold"
              disabled={requestCodeMutation.isPending}
            >
              {requestCodeMutation.isPending ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
