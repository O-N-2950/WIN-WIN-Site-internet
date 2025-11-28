# 🚀 Guide de Déploiement Railway - WIN WIN Finance Group

## 📋 Changements Effectués

### ✅ **1. Configuration CORS**

Le serveur backend a été configuré pour accepter les requêtes depuis www.winwin.swiss.

**Fichier modifié :** `server/_core/index.ts`

**Origines autorisées :**
- `https://www.winwin.swiss`
- `https://winwin.swiss`
- `http://localhost:3000` (développement)
- `http://localhost:5173` (développement)

### ✅ **2. Migration vers Cloudinary**

L'upload de fichiers a été migré de tmpfiles.org (bloqué par les adblockers) vers Cloudinary.

**Fichiers créés/modifiés :**
- `server/lib/cloudinary-upload.ts` (nouveau module)
- `server/routers/contact.ts` (endpoint `uploadAttachment`)
- `client/src/pages/Contact.tsx` (upload via backend)

### ✅ **3. Gestion d'Erreurs Globale**

Un middleware de gestion d'erreurs a été ajouté pour logger et retourner des erreurs propres.

---

## 🔧 Configuration Railway Requise

### **Variables d'Environnement à Ajouter**

Connectez-vous à Railway Dashboard → Votre projet → Variables

#### **1. Cloudinary (OBLIGATOIRE)**

Créez un compte gratuit sur [Cloudinary](https://cloudinary.com/users/register/free) :

```
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Comment obtenir ces valeurs :**
1. Créer un compte sur https://cloudinary.com
2. Aller dans Dashboard → Account Details
3. Copier les 3 valeurs (Cloud Name, API Key, API Secret)

#### **2. Variables Existantes (À Vérifier)**

Assurez-vous que ces variables sont déjà configurées :

```
# Airtable
AIRTABLE_API_KEY=patBP3F...
AIRTABLE_BASE_ID=appZQkRJ7PwOtdQ3O

# Port (IMPORTANT : doit être dynamique)
PORT=${{PORT}}

# Node Environment
NODE_ENV=production

# JWT Secret (pour les sessions)
JWT_SECRET=votre_secret_jwt
```

---

## 📦 Déploiement

### **Étape 1 : Commit et Push**

```bash
git add .
git commit -m "fix: Add CORS configuration and migrate to Cloudinary"
git push origin main
```

### **Étape 2 : Configurer Cloudinary dans Railway**

1. Aller sur Railway Dashboard
2. Sélectionner votre projet
3. Aller dans l'onglet **Variables**
4. Cliquer sur **New Variable**
5. Ajouter les 3 variables Cloudinary

### **Étape 3 : Redéployer**

Railway va automatiquement redéployer après le push Git.

**OU** redéployer manuellement :
1. Aller dans **Deployments**
2. Cliquer sur **Deploy**

---

## 🧪 Tests à Effectuer Après Déploiement

### **Test 1 : Formulaire SANS Pièce Jointe**

1. Aller sur https://www.winwin.swiss/contact
2. Remplir le formulaire (nom, email, message)
3. **NE PAS** ajouter de pièce jointe
4. Cliquer sur "Envoyer"
5. ✅ **Résultat attendu :** Message de succès + lead créé dans Airtable

### **Test 2 : Formulaire AVEC Pièce Jointe**

1. Aller sur https://www.winwin.swiss/contact
2. Remplir le formulaire
3. Ajouter une pièce jointe (PDF, image, etc.)
4. Cliquer sur "Envoyer"
5. ✅ **Résultat attendu :** 
   - Message de succès
   - Lead créé dans Airtable
   - Pièce jointe uploadée sur Cloudinary
   - URL Cloudinary dans Airtable

---

## 🔍 Vérification des Logs Railway

### **Logs à Surveiller**

1. Aller dans Railway Dashboard → Deployments → View Logs

2. **Logs de démarrage attendus :**
```
[CORS] Configured for origins: [ 'https://www.winwin.swiss', ... ]
[OAuth] Routes registered
[Google Calendar] Callback route registered
[Cal.com] Webhook route registered
Server running on http://localhost:3000/
```

3. **Logs d'erreur à surveiller :**
```
[CORS] Blocked origin: https://example.com  ← Origine non autorisée
[Cloudinary] Upload error: ...  ← Problème Cloudinary
[Server Error] ...  ← Erreur serveur
```

---

## ❌ Dépannage

### **Problème 1 : CORS Blocked**

**Symptôme :** Erreur "CORS policy" dans la console du navigateur

**Solution :**
1. Vérifier que l'origine est bien dans la liste autorisée (`server/_core/index.ts`)
2. Vérifier que le serveur a bien redémarré après le déploiement
3. Vider le cache du navigateur (Ctrl+Shift+R)

### **Problème 2 : Cloudinary Upload Failed**

**Symptôme :** Erreur "Cloudinary not configured" ou "Failed to upload"

**Solution :**
1. Vérifier que les 3 variables Cloudinary sont configurées dans Railway
2. Vérifier que les valeurs sont correctes (pas d'espaces, pas de guillemets)
3. Redéployer après avoir ajouté les variables

### **Problème 3 : Formulaire Ne Répond Pas**

**Symptôme :** Aucun message d'erreur, le formulaire ne fait rien

**Solution :**
1. Ouvrir la console du navigateur (F12)
2. Aller dans l'onglet "Network"
3. Soumettre le formulaire
4. Vérifier les requêtes HTTP :
   - Si 404 → Backend non accessible
   - Si 500 → Erreur serveur (voir logs Railway)
   - Si CORS → Voir Problème 1

---

## 📊 Monitoring

### **Métriques à Surveiller**

1. **Taux de succès des formulaires**
   - Vérifier dans Airtable que les leads sont créés

2. **Uploads Cloudinary**
   - Aller dans Cloudinary Dashboard → Media Library
   - Vérifier que les fichiers sont bien uploadés

3. **Logs d'Erreurs**
   - Surveiller les logs Railway pour détecter les erreurs

---

## 🎯 Checklist de Déploiement

- [ ] Code commité et pushé sur GitHub
- [ ] Variables Cloudinary ajoutées dans Railway
- [ ] Déploiement Railway terminé sans erreur
- [ ] Logs Railway affichent "[CORS] Configured"
- [ ] Test formulaire SANS pièce jointe réussi
- [ ] Test formulaire AVEC pièce jointe réussi
- [ ] Lead créé dans Airtable avec URL Cloudinary
- [ ] Email de notification reçu par contact@winwin.swiss

---

## 📞 Support

En cas de problème persistant :

1. **Vérifier les logs Railway** (Deployments → View Logs)
2. **Vérifier la console navigateur** (F12 → Console + Network)
3. **Vérifier Airtable** (table "Leads Site Web")
4. **Vérifier Cloudinary** (Media Library)

---

## 🔗 Liens Utiles

- **Railway Dashboard :** https://railway.app/dashboard
- **Cloudinary Dashboard :** https://cloudinary.com/console
- **Airtable Base :** https://airtable.com/appZQkRJ7PwOtdQ3O
- **Site Web :** https://www.winwin.swiss

---

**✅ Une fois tous les tests validés, le formulaire de contact sera pleinement fonctionnel !**
