import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT_INFO } from "@/const";
import { Phone, Calendar, Mail, ArrowRight, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function Conseil() {
  const [selectedOption, setSelectedOption] = useState<'appel' | 'rdv' | 'message' | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    typeClient: "",
    message: "",
    dateRdv: "",
    heureRdv: "",
  });

  const handleSubmitRdv = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Intégrer Cal.com ou envoyer à Airtable
    toast.success("Demande de rendez-vous envoyée ! Nous vous confirmerons rapidement.");
    console.log("RDV:", formData);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer à Airtable + notification email
    toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
    console.log("Message:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Parlons de Vos Assurances
            </h1>
            <p className="text-xl text-white/90">
              Choisissez la méthode de contact qui vous convient le mieux
            </p>
          </motion.div>
        </div>
      </section>

      {/* Options de Contact */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Option 1 : Appel Express */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                  selectedOption === 'appel' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOption('appel')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Appel Express</CardTitle>
                  <CardDescription className="text-base">
                    Besoin d'une réponse rapide ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="block"
                  >
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                      <Phone className="mr-2 h-5 w-5" />
                      {CONTACT_INFO.phone}
                    </Button>
                  </a>
                  <p className="text-sm text-muted-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Lun-Ven 8h-18h
                  </p>
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Réponse immédiate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Conseils personnalisés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Sans engagement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Option 2 : Réserver un Entretien */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 border-primary ${
                  selectedOption === 'rdv' ? 'ring-2 ring-primary shadow-xl' : ''
                }`}
                onClick={() => setSelectedOption('rdv')}
              >
                <CardHeader className="text-center">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      RECOMMANDÉ
                    </span>
                  </div>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Réserver un Entretien</CardTitle>
                  <CardDescription className="text-base">
                    Entretien personnalisé (15-30 min)
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => setSelectedOption('rdv')}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Choisir mon créneau
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Confirmation immédiate
                  </p>
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Conseiller dédié</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Analyse approfondie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Rappel automatique 24h avant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Option 3 : Envoyer un Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                  selectedOption === 'message' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOption('message')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Envoyer un Message</CardTitle>
                  <CardDescription className="text-base">
                    Décrivez votre situation
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedOption('message')}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Réponse sous 24h garantie
                  </p>
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Disponible 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Réponse détaillée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Sans engagement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Formulaire de Réservation d'Entretien */}
          {selectedOption === 'rdv' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Réserver votre entretien</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire et nous vous confirmerons rapidement votre créneau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRdv} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom complet *</Label>
                        <Input
                          id="nom"
                          required
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean.dupont@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          required
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="+41 79 123 45 67"
                        />
                      </div>
                      <div>
                        <Label htmlFor="typeClient">Type de besoin *</Label>
                        <Select
                          value={formData.typeClient}
                          onValueChange={(value) => setFormData({ ...formData, typeClient: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="particulier">Particulier</SelectItem>
                            <SelectItem value="entreprise">Entreprise</SelectItem>
                            <SelectItem value="les-deux">Privé + Entreprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateRdv">Date souhaitée</Label>
                        <Input
                          id="dateRdv"
                          type="date"
                          value={formData.dateRdv}
                          onChange={(e) => setFormData({ ...formData, dateRdv: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heureRdv">Heure souhaitée</Label>
                        <Select
                          value={formData.heureRdv}
                          onValueChange={(value) => setFormData({ ...formData, heureRdv: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                            <SelectItem value="17:00">17:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Votre situation en quelques mots (optionnel)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez brièvement votre situation ou vos besoins..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Confirmer ma demande de rendez-vous
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Formulaire de Contact */}
          {selectedOption === 'message' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Nous vous répondrons sous 24h avec une réponse détaillée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMessage} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom-msg">Nom complet *</Label>
                        <Input
                          id="nom-msg"
                          required
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-msg">Email *</Label>
                        <Input
                          id="email-msg"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean.dupont@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telephone-msg">Téléphone *</Label>
                        <Input
                          id="telephone-msg"
                          type="tel"
                          required
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="+41 79 123 45 67"
                        />
                      </div>
                      <div>
                        <Label htmlFor="typeClient-msg">Type de besoin *</Label>
                        <Select
                          value={formData.typeClient}
                          onValueChange={(value) => setFormData({ ...formData, typeClient: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="particulier">Particulier</SelectItem>
                            <SelectItem value="entreprise">Entreprise</SelectItem>
                            <SelectItem value="les-deux">Privé + Entreprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message-msg">Votre message *</Label>
                      <Textarea
                        id="message-msg"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez votre situation, vos besoins ou vos questions..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Envoyer mon message
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Réassurance */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi nous contacter ?</h2>
            <p className="text-lg text-muted-foreground">
              Plus de 30 ans d'expérience au service de votre protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Conseils Personnalisés</h3>
              <p className="text-sm text-muted-foreground">
                Chaque situation est unique, nos recommandations aussi
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sans Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Aucune obligation, juste des conseils d'experts
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Réponse Rapide</h3>
              <p className="text-sm text-muted-foreground">
                Nous nous engageons à vous répondre rapidement
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
