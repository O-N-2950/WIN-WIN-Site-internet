import { useEffect } from 'react';

/**
 * Hook pour définir dynamiquement le titre de la page (onglet du navigateur)
 * @param title - Le titre de la page (ex: "Accueil", "Services", etc.)
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const baseTitle = 'WIN WIN Finance Group';
    document.title = title ? `${baseTitle} - ${title}` : baseTitle;
    
    // Cleanup: restaurer le titre par défaut quand le composant est démonté
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}
