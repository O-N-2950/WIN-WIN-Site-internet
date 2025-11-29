import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INFO } from "@/const";
import { Phone, Calendar, Mail, ArrowRight, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Conseil() {
  const [selectedOption, setSelectedOption] = useState<'appel' | 'rdv' | 'message' | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sendContactRequest = trpc.appointment.sendContactRequest.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
      setFormData({ nom: "", email: "", telephone: "", message: "" });
      setSelectedFile(null);
      setFilePreview(null);
      setSelectedOption(null);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi : " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 10 MB)
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux. Taille maximale : 10 MB");
      return;
    }

    // Vérifier le type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Formats acceptés : PDF, JPG, PNG");
      return;
    }

    setSelectedFile(file);

    // Créer preview pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const uploadFile = trpc.upload.uploadFile.useMutation();

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let attachmentUrl: string | undefined;

    // Si un fichier est sélectionné, l'uploader d'abord
    if (selectedFile) {
      setIsUploading(true);
      try {
        // Convertir le fichier en base64
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        // Upload vers S3
        const uploadResult = await uploadFile.mutateAsync({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileData,
        });

        attachmentUrl = uploadResult.url;
      } catch (error) {
        toast.error("Erreur lors de l'upload du fichier");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Envoyer le message avec l'URL du fichier
    sendContactRequest.mutate({
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      typeClient: "prive", // Valeur par défaut pour les messages
      message: formData.message,
      attachmentUrl,
    });
  };

  // Charger le script Cal.com
  useEffect(() => {
    // Vérifier si le script est déjà chargé
    if (document.querySelector('script[src="https://app.cal.com/embed/embed.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.Cal) {
        // @ts-ignore
        window.Cal("init", { origin: "https://cal.com" });
        
        // Configuration UI pour les couleurs WIN WIN
        // @ts-ignore
        window.Cal("ui", {
          theme: "light",
          styles: {
            branding: {
              brandColor: "#3176A6" // Bleu WIN WIN
            }
          },
          hideEventTypeDetails: false,
          layout: "month_view"
        });
      }
    };

    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

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

          {/* Widget Cal.com pour Réservation d'Entretien */}
          {selectedOption === 'rdv' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Choisissez votre créneau</CardTitle>
                  <CardDescription className="text-center">
                    Sélectionnez la durée d'entretien qui vous convient
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Option 15 minutes */}
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-primary/5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Question Express</h3>
                        <p className="text-sm text-muted-foreground">Réponse rapide à une question précise (15 min)</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                        <Clock className="h-4 w-4" />
                        15 min
                      </div>
                    </div>
                    <div
                      data-cal-link="winwin/15min"
                      data-cal-config='{"layout":"month_view","theme":"light"}'
                      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                      className="min-h-[600px]"
                    ></div>
                  </div>

                  {/* Séparateur */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted-foreground font-medium">OU</span>
                    </div>
                  </div>

                  {/* Option 30 minutes */}
                  <div className="border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10 relative">
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                        RECOMMANDÉ
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Entretien Conseil</h3>
                        <p className="text-sm text-muted-foreground">Analyse approfondie de vos besoins (30 min)</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold">
                        <Clock className="h-4 w-4" />
                        30 min
                      </div>
                    </div>
                    <div
                      data-cal-link="winwin/30min"
                      data-cal-config='{"layout":"month_view","theme":"light"}'
                      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                      className="min-h-[600px]"
                    ></div>
                  </div>

                  {/* Informations complémentaires */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-900">Vous ne voyez que les créneaux disponibles</p>
                        <p className="text-blue-700">
                          Notre système vérifie automatiquement les disponibilités en temps réel. 
                          Après réservation, vous recevrez une confirmation par email avec un lien Google Meet.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Formulaire de Message */}
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
                    Décrivez votre situation et nous vous répondrons sous 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMessage} className="space-y-6">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="nom">Nom complet *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                          placeholder="Jean Dupont"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="jean.dupont@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="+41 79 123 45 67"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Votre message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={6}
                          placeholder="Décrivez votre situation et vos besoins..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="file">Joindre un document (optionnel)</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Formats acceptés : PDF, JPG, PNG (max 10 MB)
                        </p>
                        
                        {selectedFile && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{selectedFile.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setFilePreview(null);
                                }}
                              >
                                Supprimer
                              </Button>
                            </div>
                            {filePreview && (
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                className="mt-2 max-h-40 rounded border"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={sendContactRequest.isPending || isUploading}
                    >
                      {isUploading ? (
                        <>Upload du fichier...</>
                      ) : sendContactRequest.isPending ? (
                        <>Envoi en cours...</>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Confiance */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Pourquoi nous faire confiance ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">30 ans</div>
              <p className="text-muted-foreground">d'expérience en gestion d'assurances</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">clients satisfaits</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">de satisfaction client</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
