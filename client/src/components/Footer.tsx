import { APP_LOGO, APP_TITLE, CONTACT_INFO, COMPANY_INFO, SERVICES_LINKS } from "@/const";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-auto" />
              <span className="font-bold text-lg text-primary">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre partenaire de confiance pour tous vos besoins en assurances et prévoyance.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>FINMA: {COMPANY_INFO.finma}</p>
              <p>Directeur: {COMPANY_INFO.director.name}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/conseil" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Formulaire de conseil
                </Link>
              </li>
              <li>
                <Link href="/conseil" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={SERVICES_LINKS.talentis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Concept Talentis
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SERVICES_LINKS.durabilis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Concept Durabilis
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SERVICES_LINKS.parentsEnfants}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Assurance Parents-Enfants
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tous nos services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="text-sm text-muted-foreground inline-flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {CONTACT_INFO.address.street}<br />
                  {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}<br />
                  {CONTACT_INFO.address.country}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clause de Responsabilité */}
        <div className="mt-12 pt-8 border-t">
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Responsabilité et rôle limité</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              WIN WIN Finance Group Sàrl propose un service d'accompagnement à la création d'entreprise en Suisse, 
              incluant la mise en relation avec des prestataires (fiduciaires, banques, assureurs) et la gestion 
              des assurances professionnelles par le biais de mandats de courtage. 
              <strong>Nous n'intervenons en aucun cas comme administrateur, organe, associé ou représentant légal 
              des sociétés créées ou accompagnées.</strong> Notre rôle est strictement limité au conseil et à la gestion 
              des assurances, sur la base de mandats de courtage conformes à la LSA. Chaque entrepreneur demeure seul 
              responsable de la gestion juridique, comptable et financière de son entreprise.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {COMPANY_INFO.legalName}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
