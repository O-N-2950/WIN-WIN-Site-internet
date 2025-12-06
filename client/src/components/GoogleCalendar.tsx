interface GoogleCalendarProps {
  /** URL de la page de réservation Google Calendar */
  bookingUrl: string;
  /** Hauteur minimale de l'iframe (par défaut 600px) */
  minHeight?: string;
  /** Titre affiché au-dessus du calendrier */
  title?: string;
  /** Description affichée sous le titre */
  description?: string;
}

/**
 * Composant pour intégrer Google Calendar Appointment Scheduling
 * 
 * @example
 * ```tsx
 * <GoogleCalendar 
 *   bookingUrl="https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID"
 *   title="Réserver un entretien"
 *   description="Choisissez le créneau qui vous convient"
 * />
 * ```
 * 
 * Pour obtenir votre URL de réservation :
 * 1. Allez sur https://calendar.google.com
 * 2. Cliquez sur l'icône ⚙️ (Paramètres) → "Paramètres"
 * 3. Dans le menu de gauche, cliquez sur "Pages de réservation"
 * 4. Créez une nouvelle page de réservation ou sélectionnez-en une existante
 * 5. Copiez l'URL de la page de réservation
 */
export default function GoogleCalendar({ 
  bookingUrl, 
  minHeight = '600px',
  title,
  description 
}: GoogleCalendarProps) {
  return (
    <div className="space-y-4">
      {title && (
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <iframe
          src={bookingUrl}
          style={{ 
            width: '100%', 
            minHeight,
            border: 'none'
          }}
          title="Google Calendar Appointment Scheduling"
          loading="lazy"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-2">
            <p className="font-semibold text-blue-900">Réservation instantanée</p>
            <p className="text-blue-700">
              Vous ne voyez que les créneaux disponibles. Après réservation, vous recevrez une confirmation par email avec un lien Google Meet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
