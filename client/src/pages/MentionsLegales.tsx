import { APP_TITLE, COMPANY_INFO, CONTACT_INFO } from "@/const";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentionsLegales() {
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
          Mentions légales
        </h1>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Éditeur du site
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
              <strong>IDE :</strong> {COMPANY_INFO.ide}
              <br />
              <strong>Téléphone :</strong> {CONTACT_INFO.phone}
              <br />
              <strong>Email :</strong>{" "}
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
              Directeur de la publication
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.director.name}
              <br />
              {COMPANY_INFO.director.title}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Autorisation FINMA
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.legalName} est agréée par la FINMA (Autorité fédérale de surveillance des marchés financiers) en tant qu'intermédiaire d'assurance.
              <br />
              <strong>Numéro d'agrément FINMA :</strong> {COMPANY_INFO.finma}
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Conformément à la Loi sur la surveillance des assurances (LSA), nous exerçons notre activité de courtage en assurances en toute indépendance et dans le respect des obligations légales et réglementaires en vigueur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hébergement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site est hébergé en Suisse par :
              <br />
              <strong>Railway Corp.</strong>
              <br />
              Infrastructure cloud avec hébergement de données en Suisse
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, logos, graphismes, vidéos, etc.) est la propriété exclusive de {COMPANY_INFO.legalName} ou de ses partenaires, et est protégé par les lois suisses et internationales relatives à la propriété intellectuelle.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de {COMPANY_INFO.legalName}.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Responsabilité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.legalName} s'efforce de fournir sur ce site des informations aussi précises que possible. Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Toutes les informations indiquées sur ce site sont données à titre indicatif, et sont susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur ce site ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Liens hypertextes
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site www.winwin.swiss.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse de {COMPANY_INFO.legalName}. Aucune autorisation ou demande d'information préalable ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur. Il convient toutefois d'afficher ce site dans une nouvelle fenêtre du navigateur. Cependant, {COMPANY_INFO.legalName} se réserve le droit de demander la suppression d'un lien qu'elle estime non conforme à l'objet du site www.winwin.swiss.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Limitation de responsabilité pour la création d'entreprise
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.legalName} propose un service d'accompagnement à la création d'entreprise en Suisse, incluant la mise en relation avec des prestataires (fiduciaires, banques, assureurs) et la gestion des assurances professionnelles par le biais de mandats de courtage.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Nous n'intervenons en aucun cas comme administrateur, organe, associé ou représentant légal des sociétés créées ou accompagnées.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Notre rôle est strictement limité au conseil et à la gestion des assurances, sur la base de mandats de courtage conformes à la LSA.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Chaque entrepreneur demeure seul responsable de la gestion juridique, comptable et financière de son entreprise.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Droit applicable et juridiction compétente
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tout litige en relation avec l'utilisation du site www.winwin.swiss est soumis au droit suisse. Il est fait attribution exclusive de juridiction aux tribunaux compétents du canton du Jura, Suisse.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question ou demande d'information concernant le site, ou tout signalement de contenu ou d'activités illicites, l'utilisateur peut contacter l'éditeur à l'adresse suivante :
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
