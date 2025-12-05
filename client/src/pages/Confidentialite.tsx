import { APP_TITLE, COMPANY_INFO, CONTACT_INFO } from "@/const";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Titre */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.legalName} accorde une grande importance à la protection de vos données personnelles. La présente politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, stockons et protégeons vos données personnelles conformément à la Loi fédérale sur la protection des données (LPD) et au Règlement général sur la protection des données (RGPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Responsable du traitement des données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>{COMPANY_INFO.legalName}</strong>
              <br />
              {CONTACT_INFO.address.street}
              <br />
              {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}
              <br />
              Suisse
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Email :</strong>{" "}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-primary hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
              <br />
              <strong>Téléphone :</strong> {CONTACT_INFO.phone}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Données collectées
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous collectons les données personnelles suivantes :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Données d'identification :</strong> nom, prénom, date de naissance, adresse postale</li>
              <li><strong>Données de contact :</strong> adresse email, numéro de téléphone</li>
              <li><strong>Données professionnelles :</strong> statut professionnel, nom de l'entreprise, fonction</li>
              <li><strong>Données d'assurance :</strong> polices d'assurance existantes, besoins en couverture, sinistres</li>
              <li><strong>Données de paiement :</strong> informations de facturation (traitées par Stripe, notre prestataire de paiement sécurisé)</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de visite</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Finalités du traitement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles sont collectées et traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li>Gestion de votre mandat de courtage en assurances</li>
              <li>Analyse de vos besoins et conseil personnalisé</li>
              <li>Établissement et gestion de vos contrats d'assurance</li>
              <li>Suivi de votre dossier et gestion des sinistres</li>
              <li>Facturation et gestion des paiements</li>
              <li>Communication avec vous (emails, téléphone, courrier)</li>
              <li>Amélioration de nos services et de notre site web</li>
              <li>Respect de nos obligations légales et réglementaires (FINMA, LSA)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Base légale du traitement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Le traitement de vos données personnelles repose sur les bases légales suivantes :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Exécution du contrat :</strong> traitement nécessaire à l'exécution de votre mandat de courtage</li>
              <li><strong>Obligation légale :</strong> respect des obligations imposées par la FINMA et la LSA</li>
              <li><strong>Intérêt légitime :</strong> amélioration de nos services, sécurité de notre système d'information</li>
              <li><strong>Consentement :</strong> pour l'envoi de communications marketing (révocable à tout moment)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Destinataires des données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles peuvent être communiquées aux destinataires suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Compagnies d'assurance :</strong> pour l'établissement et la gestion de vos contrats</li>
              <li><strong>Prestataires de services :</strong> hébergement (Railway), paiement (Stripe), CRM (Airtable)</li>
              <li><strong>Autorités compétentes :</strong> FINMA, administration fiscale, en cas d'obligation légale</li>
              <li><strong>Partenaires :</strong> fiduciaires, banques, dans le cadre de nos services d'accompagnement à la création d'entreprise</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Tous nos prestataires sont soumis à des obligations contractuelles strictes en matière de protection des données et ne peuvent utiliser vos données que pour les finalités définies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Durée de conservation
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Données de mandat actif :</strong> durée du mandat + 10 ans (obligation légale LSA)</li>
              <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
              <li><strong>Données de navigation :</strong> 12 mois maximum</li>
              <li><strong>Données marketing :</strong> jusqu'à révocation de votre consentement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vos droits
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Conformément à la LPD et au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données (sous réserve des obligations légales)</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données dans certains cas</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour des raisons légitimes</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et couramment utilisé</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment, sans affecter la licéité du traitement antérieur</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour exercer vos droits, contactez-nous à l'adresse :{" "}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-primary hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sécurité des données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction :
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Hébergement sécurisé en Suisse</li>
              <li>Accès restreint aux données (principe du moindre privilège)</li>
              <li>Sauvegardes régulières et plan de reprise d'activité</li>
              <li>Formation continue de nos collaborateurs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookies et technologies similaires
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation et analyser l'utilisation du site. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Types de cookies utilisés :</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-4 space-y-2">
              <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
              <li><strong>Cookies analytiques :</strong> pour comprendre comment vous utilisez notre site (anonymisés)</li>
              <li><strong>Cookies de préférence :</strong> pour mémoriser vos choix (langue, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transferts internationaux
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles sont principalement stockées en Suisse. Certains de nos prestataires de services (Stripe, Airtable) peuvent être situés hors de Suisse. Dans ce cas, nous nous assurons que des garanties appropriées sont en place pour protéger vos données conformément aux standards suisses et européens.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Modifications de la politique de confidentialité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. La version en vigueur est toujours disponible sur notre site web. Nous vous informerons de toute modification substantielle par email ou via notre site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Réclamations
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si vous estimez que vos droits en matière de protection des données ne sont pas respectés, vous pouvez déposer une réclamation auprès de l'autorité compétente :
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Préposé fédéral à la protection des données et à la transparence (PFPDT)</strong>
              <br />
              Feldeggweg 1
              <br />
              3003 Berne
              <br />
              Suisse
              <br />
              <a
                href="https://www.edoeb.admin.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.edoeb.admin.ch
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, contactez-nous :
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Email :</strong>{" "}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-primary hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
              <br />
              <strong>Téléphone :</strong> {CONTACT_INFO.phone}
              <br />
              <strong>Courrier :</strong> {CONTACT_INFO.address.street}, {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}, Suisse
            </p>
          </section>
        </div>

        {/* Date de mise à jour */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-CH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
