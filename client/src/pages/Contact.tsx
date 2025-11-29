// import { Button } from "@/components/ui/button"; // Remplacé par <button> HTML natif
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INFO, COMPANY_INFO, ROUTES, BRAND_COLORS } from "@/const";
import FileUpload from "@/components/FileUpload";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessageMutation = trpc.contact.sendMessage.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    // LOG AVANT TOUT pour vérifier si la fonction s'exécute
    console.log('🚀 [Contact] handleSubmit APPELÉ !');
    console.log('🚀 [Contact] Event type:', e.type);
    console.log('🚀 [Contact] Event target:', e.target);
    
    // CRITIQUE : empêcher le comportement par défaut
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== DÉBUT SUBMIT ===');
    console.log('[Contact] FormData:', formData);
    console.log('[Contact] Selected file:', selectedFile);
    
    // Validation manuelle (car noValidate désactive HTML5 validation)
    if (!formData.nom?.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      toast.error('Email invalide');
      return;
    }
    
    if (!formData.sujet?.trim()) {
      toast.error('Le sujet est requis');
      return;
    }
    
    if (!formData.message?.trim()) {
      toast.error('Le message est requis');
      return;
    }
    
    setIsSubmitting(true);

    try {
      let attachmentUrl: string | undefined;
      let attachmentFilename: string | undefined;

      // 1. Upload du fichier si présent (via backend pour sécurité)
      console.log('[Contact] Selected file:', selectedFile);
      if (selectedFile) {
        console.log('[Contact] Starting file upload...');
        // Convertir le fichier en base64
        console.log('[Contact] Converting file to base64...');
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        // Uploader via le backend (qui utilise Cloudinary)
        console.log('[Contact] Base64 length:', base64.length);
        console.log('[Contact] Calling uploadAttachment...');
        const uploadResult = await trpc.contact.uploadAttachment.mutateAsync({
          base64Data: base64,
          filename: selectedFile.name,
        });

        console.log('[Contact] Upload result:', uploadResult);
        attachmentUrl = uploadResult.url;
        attachmentFilename = selectedFile.name;
        console.log('[Contact] Attachment URL:', attachmentUrl);
      }

      // 2. Envoyer le message via tRPC
      await sendMessageMutation.mutateAsync({
        ...formData,
        attachmentUrl,
        attachmentFilename,
      });

      toast.success("Message envoyé !", {
        description: "Nous vous répondrons dans les 48 heures.",
      });

      // Reset form
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        sujet: "",
        message: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('[Contact] ERREUR DÉTAILLÉE:', error);
      if (error instanceof Error) {
        console.error('[Contact] Error message:', error.message);
        console.error('[Contact] Error stack:', error.stack);
      }
      toast.error("Erreur", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
      console.log('=== FIN SUBMIT ===');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-32 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 45%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              Nous sommes à votre écoute pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire de Contact */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Envoyez-nous un Message</CardTitle>
                  <CardDescription className="text-base">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les 48 heures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom complet *</Label>
                      <Input
                        id="nom"
                        name="nom"
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean.dupont@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        placeholder="079 123 45 67"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet *</Label>
                      <Input
                        id="sujet"
                        name="sujet"
                        type="text"
                        placeholder="Demande d'information sur..."
                        value={formData.sujet}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez votre demande..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Joindre un document (optionnel)</Label>
                      <FileUpload
                        onFileSelect={setSelectedFile}
                        acceptedFormats=".pdf,.jpg,.jpeg,.png"
                        maxSize={10}
                      />
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : PDF, JPG, PNG (max 10 MB)
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer le Message
                        </>
                      )}
                    </button>

                    <p className="text-sm text-muted-foreground text-center">
                      * Champs obligatoires
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informations de Contact */}
            <div className="space-y-8">
              {/* Coordonnées */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Nos Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.name}<br />
                        {CONTACT_INFO.address.street}<br />
                        {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}<br />
                        {CONTACT_INFO.address.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>
                          <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                            Fixe : {CONTACT_INFO.phone}
                          </a>
                        </p>
                        <p>
                          <a href={`tel:${CONTACT_INFO.mobile.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                            Mobile : {CONTACT_INFO.mobile}
                          </a>
                        </p>
                        <p>
                          <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                            WhatsApp : {CONTACT_INFO.whatsapp}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horaires</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lundi - Vendredi : 8h00 - 18h00</p>
                        <p>Samedi : Sur rendez-vous</p>
                        <p>Dimanche : Fermé</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Autres Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Autres Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={ROUTES.questionnaire}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Analyse Gratuite
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Remplissez notre questionnaire en ligne
                      </p>
                    </div>
                  </a>

                  <a
                    href="#" // TODO: Ajouter route appointment
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Rendez-vous
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        À notre bureau ou en visioconférence
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Urgences</h3>
                      <p className="text-sm text-muted-foreground">
                        Disponible 7j/7 pour les sinistres
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nous Trouver</h2>
            <p className="text-xl text-muted-foreground">
              {CONTACT_INFO.address.street}, {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps?q=Bellevue+7,+2950+Courgenay,+Switzerland&output=embed&z=15"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte Google Maps - WIN WIN Finance Group"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Questions Fréquentes</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quel est le délai de réponse ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous nous engageons à vous répondre dans les 48 heures ouvrables maximum.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Les consultations sont-elles payantes ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    La première consultation et l'analyse de votre situation sont entièrement gratuites et sans engagement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Puis-je prendre rendez-vous en dehors des horaires ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oui, nous proposons des rendez-vous en soirée et le samedi sur demande.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Intervenez-vous dans toute la Suisse ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oui, nous intervenons dans toute la Suisse romande et germanophone, en présentiel ou en visioconférence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
