import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INFO, COMPANY_INFO, ROUTES } from "@/const";
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

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implémenter l'envoi vers Airtable via tRPC
      // Pour l'instant, simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
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
                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
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
                    </Button>

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
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.legalName}<br />
                        {CONTACT_INFO.address.street}<br />
                        {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}<br />
                        {CONTACT_INFO.address.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">
                        <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                          Fixe : {CONTACT_INFO.phone}
                        </a>
                        <br />
                        <a href={`tel:${CONTACT_INFO.mobile.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                          Mobile : {CONTACT_INFO.mobile}
                        </a>
                        <br />
                        <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          WhatsApp : {CONTACT_INFO.whatsapp}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors">
                          {CONTACT_INFO.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horaires</h3>
                      <p className="text-muted-foreground">
                        Lundi - Vendredi : 8h00 - 18h00<br />
                        Samedi : Sur rendez-vous<br />
                        Dimanche : Fermé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Autres Moyens de Contact */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Autres Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Analyse Gratuite</p>
                      <p className="text-sm text-muted-foreground">
                        Remplissez notre questionnaire en ligne
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Rendez-vous</p>
                      <p className="text-sm text-muted-foreground">
                        À notre bureau ou en visioconférence
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Urgences</p>
                      <p className="text-sm text-muted-foreground">
                        Disponible 7j/7 pour les sinistres
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carte */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Nous Trouver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.8!2d7.0!3d47.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDI0JzAwLjAiTiA3wrAwMCcwMC4wIkU!5e0!3m2!1sfr!2sch!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Carte WIN WIN Finance Group"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {CONTACT_INFO.address.street}, {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Rapide */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes</h2>
            <div className="space-y-6">
              {[
                {
                  question: "Quel est le délai de réponse ?",
                  reponse: "Nous nous engageons à vous répondre dans les 48 heures ouvrables maximum."
                },
                {
                  question: "Les consultations sont-elles payantes ?",
                  reponse: "La première consultation et l'analyse de votre situation sont entièrement gratuites et sans engagement."
                },
                {
                  question: "Puis-je prendre rendez-vous en dehors des horaires ?",
                  reponse: "Oui, nous proposons des rendez-vous en soirée et le samedi sur demande."
                },
                {
                  question: "Intervenez-vous dans toute la Suisse ?",
                  reponse: "Oui, nous intervenons dans toute la Suisse romande et germanophone, en présentiel ou en visioconférence."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.reponse}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
