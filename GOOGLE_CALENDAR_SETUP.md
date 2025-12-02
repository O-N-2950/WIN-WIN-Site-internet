# Configuration Google Calendar Appointment Scheduling

## 📋 Objectif
Remplacer Cal.com par Google Calendar Appointment Scheduling (inclus gratuitement dans Google Workspace).

---

## 🚀 Étapes de Configuration

### 1. Créer votre page de réservation Google Calendar

1. **Allez sur Google Calendar** : https://calendar.google.com
2. **Cliquez sur l'icône ⚙️** (Paramètres) en haut à droite
3. **Sélectionnez "Paramètres"** dans le menu déroulant
4. **Dans le menu de gauche**, cliquez sur **"Pages de réservation"**
5. **Cliquez sur "Créer"** pour créer une nouvelle page de réservation

### 2. Configurer vos créneaux de disponibilité

#### **Pour "Question Express" (15 minutes)**
1. **Nom** : Question Express
2. **Durée** : 15 minutes
3. **Lieu** : Google Meet (généré automatiquement)
4. **Disponibilités** : 
   - Lundi-Vendredi : 9h00-12h00 et 14h00-17h00
   - Ou selon vos préférences
5. **Délai de réservation** : Au moins 2 heures à l'avance
6. **Cliquez sur "Enregistrer"**
7. **Copiez l'URL de la page de réservation**

#### **Pour "Entretien Conseil" (30 minutes)**
1. **Nom** : Entretien Conseil
2. **Durée** : 30 minutes
3. **Lieu** : Google Meet (généré automatiquement)
4. **Disponibilités** : 
   - Lundi-Vendredi : 9h00-12h00 et 14h00-17h00
   - Ou selon vos préférences
5. **Délai de réservation** : Au moins 4 heures à l'avance
6. **Cliquez sur "Enregistrer"**
7. **Copiez l'URL de la page de réservation**

### 3. Intégrer les URLs dans le site

1. **Ouvrez le fichier** : `client/src/pages/Conseil.tsx`
2. **Trouvez les lignes 121-122** :
   ```typescript
   const GOOGLE_CALENDAR_15MIN = "https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID_15MIN";
   const GOOGLE_CALENDAR_30MIN = "https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID_30MIN";
   ```
3. **Remplacez** `YOUR_SCHEDULE_ID_15MIN` et `YOUR_SCHEDULE_ID_30MIN` par vos URLs copiées

**Exemple :**
```typescript
const GOOGLE_CALENDAR_15MIN = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a2b3c4d5e6f7g8h9i0j";
const GOOGLE_CALENDAR_30MIN = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ9i8h7g6f5e4d3c2b1a0j";
```

### 4. Tester la réservation

1. **Allez sur votre site** : https://www.winwin.swiss/conseil
2. **Cliquez sur "Réserver un Entretien"**
3. **Vérifiez que les créneaux s'affichent correctement**
4. **Testez une réservation** pour vérifier l'email de confirmation

---

## ✅ Avantages de Google Calendar

- ✅ **Gratuit** (inclus dans Google Workspace)
- ✅ **Synchronisation automatique** avec Gmail
- ✅ **Google Meet intégré** (lien généré automatiquement)
- ✅ **Rappels automatiques** par email
- ✅ **Gestion depuis votre agenda** (pas de compte externe)
- ✅ **Notifications mobiles** (Android/iOS)

---

## 🔧 Personnalisation Avancée

### Modifier les couleurs de l'iframe (optionnel)
Google Calendar utilise les couleurs de votre compte Google Workspace. Pour personnaliser :
1. Allez dans **Paramètres Google Calendar**
2. **Thème** → Choisir "Clair" ou "Sombre"
3. Les couleurs s'appliqueront automatiquement à l'iframe

### Ajouter des questions personnalisées
1. Dans **Pages de réservation** → Sélectionnez votre page
2. **Questions personnalisées** → Ajouter des champs
3. Exemple : "Quel est l'objet de votre demande ?"

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que les URLs sont correctes (pas de caractères manquants)
2. Assurez-vous que les pages de réservation sont **publiques** (pas privées)
3. Testez les URLs directement dans votre navigateur avant de les intégrer

---

## 📝 Checklist Finale

- [ ] Page de réservation 15 min créée
- [ ] Page de réservation 30 min créée
- [ ] URLs copiées et intégrées dans Conseil.tsx
- [ ] Test de réservation effectué
- [ ] Email de confirmation reçu
- [ ] Lien Google Meet fonctionnel
