# Guide de Mise en Ligne - SwissCenter

**Site** : WIN WIN Finance Group  
**Domaine** : www.winwin.swiss  
**Hébergeur** : SwissCenter  
**Date** : 15 novembre 2025

---

## Prérequis

Avant de commencer la mise en ligne, assurez-vous d'avoir :

- ✅ Accès SSH au serveur SwissCenter
- ✅ Node.js 22.13.0 installé sur le serveur
- ✅ PM2 installé globalement (`npm install -g pm2`)
- ✅ Accès au DNS pour configurer www.winwin.swiss
- ✅ Compte Stripe configuré avec les 10 produits créés
- ✅ Base Airtable "ERP Clients WW" configurée
- ✅ Bucket S3 pour le stockage des signatures

---

## Étape 1 : Préparation du Serveur

### 1.1 Connexion SSH

```bash
ssh votre-utilisateur@swisscenter-server.ch
```

### 1.2 Installation de Node.js (si nécessaire)

```bash
# Vérifier la version de Node.js
node --version

# Si Node.js n'est pas installé ou version < 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer pnpm
npm install -g pnpm
```

### 1.3 Installation de PM2

```bash
npm install -g pm2
```

### 1.4 Créer le répertoire de déploiement

```bash
mkdir -p /var/www/winwin-website
cd /var/www/winwin-website
```

---

## Étape 2 : Upload des Fichiers

### 2.1 Depuis votre machine locale

Créer une archive du projet (sans node_modules) :

```bash
# Sur votre machine locale
cd /home/ubuntu/winwin-website
tar --exclude='node_modules' --exclude='.git' -czf winwin-website.tar.gz .
```

### 2.2 Upload vers le serveur

```bash
# Upload via SCP
scp winwin-website.tar.gz votre-utilisateur@swisscenter-server.ch:/var/www/winwin-website/

# Ou via SFTP (avec un client comme FileZilla)
```

### 2.3 Extraction sur le serveur

```bash
# Sur le serveur
cd /var/www/winwin-website
tar -xzf winwin-website.tar.gz
rm winwin-website.tar.gz
```

---

## Étape 3 : Configuration des Variables d'Environnement

### 3.1 Créer le fichier .env

```bash
cd /var/www/winwin-website
nano .env
```

### 3.2 Ajouter les variables

```env
# Node Environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT
JWT_SECRET=votre-secret-jwt-tres-long-et-securise

# Manus OAuth
VITE_APP_ID=votre-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=votre-owner-open-id
OWNER_NAME=Olivier Neukomm

# Stripe
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_publishable_key

# Manus APIs
BUILT_IN_FORGE_API_URL=https://forge-api.manus.im
BUILT_IN_FORGE_API_KEY=votre-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=votre-frontend-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge-api.manus.im

# App Config
VITE_APP_TITLE=WIN WIN Finance Group
VITE_APP_LOGO=/logo-winwin-official.jpg
```

**Important** : Remplacez toutes les valeurs `votre-xxx` par les vraies valeurs.

### 3.3 Sécuriser le fichier .env

```bash
chmod 600 .env
```

---

## Étape 4 : Installation des Dépendances

```bash
cd /var/www/winwin-website
pnpm install --prod
```

**Note** : `--prod` installe uniquement les dépendances de production (sans devDependencies).

---

## Étape 5 : Build du Frontend

```bash
cd /var/www/winwin-website/client
pnpm build
cd ..
```

Le build génère les fichiers statiques optimisés dans `client/dist/`.

---

## Étape 6 : Configuration PM2

### 6.1 Créer le fichier de configuration PM2

```bash
cd /var/www/winwin-website
nano ecosystem.config.js
```

### 6.2 Contenu du fichier

```javascript
module.exports = {
  apps: [{
    name: 'winwin-website',
    script: 'server/_core/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    cwd: '/var/www/winwin-website',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/winwin-website-error.log',
    out_file: '/var/log/pm2/winwin-website-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
```

### 6.3 Créer le répertoire des logs

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

---

## Étape 7 : Démarrage de l'Application

### 7.1 Démarrer avec PM2

```bash
cd /var/www/winwin-website
pm2 start ecosystem.config.js
```

### 7.2 Vérifier le statut

```bash
pm2 status
```

Vous devriez voir :

```
┌─────┬────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ mode    │ ↺       │ status  │ cpu      │
├─────┼────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ winwin-website     │ cluster │ 0       │ online  │ 0%       │
└─────┴────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

### 7.3 Tester localement

```bash
curl http://localhost:3000
```

Vous devriez recevoir le HTML de la page d'accueil.

### 7.4 Sauvegarder la configuration PM2

```bash
pm2 save
```

### 7.5 Configurer le démarrage automatique

```bash
pm2 startup
# Suivre les instructions affichées (copier-coller la commande sudo)
```

---

## Étape 8 : Configuration Nginx (Reverse Proxy)

### 8.1 Créer le fichier de configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/winwin-website
```

### 8.2 Contenu du fichier

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.winwin.swiss winwin.swiss;

    # Redirection HTTP vers HTTPS (après configuration SSL)
    # return 301 https://$server_name$request_uri;

    # Temporairement, servir en HTTP
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/winwin-website /etc/nginx/sites-enabled/
```

### 8.4 Tester la configuration

```bash
sudo nginx -t
```

### 8.5 Redémarrer Nginx

```bash
sudo systemctl restart nginx
```

---

## Étape 9 : Configuration DNS

### 9.1 Ajouter les enregistrements DNS

Dans votre gestionnaire DNS (chez votre registrar) :

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | www | IP_DU_SERVEUR | 3600 |
| A | @ | IP_DU_SERVEUR | 3600 |

**Note** : Remplacez `IP_DU_SERVEUR` par l'IP publique de votre serveur SwissCenter.

### 9.2 Vérifier la propagation DNS

```bash
# Depuis votre machine locale
nslookup www.winwin.swiss
dig www.winwin.swiss
```

**Attention** : La propagation DNS peut prendre de quelques minutes à 48 heures.

---

## Étape 10 : Configuration SSL (Let's Encrypt)

### 10.1 Installer Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 10.2 Obtenir le certificat SSL

```bash
sudo certbot --nginx -d www.winwin.swiss -d winwin.swiss
```

Suivre les instructions :
1. Entrer votre email
2. Accepter les conditions
3. Choisir de rediriger HTTP vers HTTPS (option 2)

### 10.3 Vérifier le renouvellement automatique

```bash
sudo certbot renew --dry-run
```

### 10.4 Tester HTTPS

Ouvrir un navigateur et aller sur `https://www.winwin.swiss`. Le site doit s'afficher avec le cadenas vert.

---

## Étape 11 : Configuration Stripe Webhook

### 11.1 Créer le webhook dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur "Add endpoint"
3. **URL** : `https://www.winwin.swiss/api/stripe/webhook`
4. **Événements à écouter** :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Cliquer sur "Add endpoint"

### 11.2 Récupérer le Webhook Secret

Après création, Stripe affiche le **Signing secret** (format `whsec_...`).

### 11.3 Mettre à jour .env

```bash
sudo nano /var/www/winwin-website/.env
```

Ajouter/modifier :

```env
STRIPE_WEBHOOK_SECRET=whsec_votre_nouveau_secret
```

### 11.4 Redémarrer l'application

```bash
pm2 restart winwin-website
```

---

## Étape 12 : Tests de Production

### 12.1 Test de la page d'accueil

Ouvrir `https://www.winwin.swiss` dans un navigateur. Vérifier :
- ✅ Logo WIN WIN affiché
- ✅ Navigation fonctionnelle
- ✅ Toutes les pages accessibles
- ✅ Design responsive (mobile, tablette, desktop)

### 12.2 Test du workflow

1. Aller sur `/questionnaire-info`
2. Cliquer sur "Commencer le Questionnaire"
3. Remplir le questionnaire (ou simuler)
4. Aller sur `/signature`
5. Signer avec la souris
6. Télécharger la signature (vérifier upload S3)
7. Aller sur `/paiement`
8. Vérifier le calcul du tarif
9. Tester le paiement Stripe (mode test)
10. Vérifier la page `/merci`
11. Vérifier la création du client dans Airtable

### 12.3 Test Stripe

**Mode Test** :
- Utiliser la carte de test : `4242 4242 4242 4242`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel 3 chiffres

**Mode Production** :
- Utiliser une vraie carte bancaire
- Vérifier la création de l'abonnement dans Stripe Dashboard
- Vérifier la réception du webhook

### 12.4 Test Airtable

1. Aller sur https://airtable.com
2. Ouvrir la base "ERP Clients WW"
3. Vérifier qu'un nouveau client a été créé
4. Vérifier les champs (nom, email, tarif, date signature, etc.)

---

## Étape 13 : Monitoring et Maintenance

### 13.1 Surveiller les logs

```bash
# Logs en temps réel
pm2 logs winwin-website

# Logs d'erreur uniquement
pm2 logs winwin-website --err

# Dernières 100 lignes
pm2 logs winwin-website --lines 100
```

### 13.2 Surveiller les performances

```bash
# Monitoring en temps réel
pm2 monit

# Informations détaillées
pm2 show winwin-website
```

### 13.3 Redémarrer l'application

```bash
# Redémarrage gracieux (sans downtime)
pm2 reload winwin-website

# Redémarrage complet
pm2 restart winwin-website
```

### 13.4 Arrêter l'application

```bash
pm2 stop winwin-website
```

### 13.5 Supprimer l'application de PM2

```bash
pm2 delete winwin-website
```

---

## Étape 14 : Mises à Jour Futures

### 14.1 Processus de mise à jour

```bash
# 1. Se connecter au serveur
ssh votre-utilisateur@swisscenter-server.ch

# 2. Aller dans le répertoire
cd /var/www/winwin-website

# 3. Sauvegarder la version actuelle
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# 4. Upload de la nouvelle version (depuis votre machine locale)
# scp winwin-website-new.tar.gz votre-utilisateur@swisscenter-server.ch:/var/www/

# 5. Extraire la nouvelle version
tar -xzf winwin-website-new.tar.gz

# 6. Installer les nouvelles dépendances
pnpm install --prod

# 7. Build le frontend
cd client && pnpm build && cd ..

# 8. Redémarrer l'application
pm2 reload winwin-website

# 9. Vérifier que tout fonctionne
pm2 logs winwin-website --lines 50
```

### 14.2 Rollback en cas de problème

```bash
# Restaurer la sauvegarde
cd /var/www/winwin-website
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz

# Redémarrer
pm2 restart winwin-website
```

---

## Dépannage

### Problème : L'application ne démarre pas

**Solution** :

```bash
# Vérifier les logs
pm2 logs winwin-website --err

# Vérifier les variables d'environnement
cat /var/www/winwin-website/.env

# Vérifier les permissions
ls -la /var/www/winwin-website

# Redémarrer PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Problème : Erreur 502 Bad Gateway

**Solution** :

```bash
# Vérifier que l'application tourne
pm2 status

# Vérifier que le port 3000 est ouvert
netstat -tuln | grep 3000

# Vérifier la configuration Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Problème : Certificat SSL expiré

**Solution** :

```bash
# Renouveler manuellement
sudo certbot renew

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Problème : Webhook Stripe ne fonctionne pas

**Solution** :

1. Vérifier l'URL du webhook dans Stripe Dashboard
2. Vérifier que `STRIPE_WEBHOOK_SECRET` est correct dans .env
3. Vérifier les logs PM2 pour voir les erreurs
4. Tester le webhook avec Stripe CLI :

```bash
stripe listen --forward-to https://www.winwin.swiss/api/stripe/webhook
```

---

## Checklist Finale

Avant de considérer la mise en ligne comme terminée, vérifier :

- [ ] Application accessible sur https://www.winwin.swiss
- [ ] Certificat SSL valide (cadenas vert)
- [ ] Logo WIN WIN affiché correctement
- [ ] Toutes les pages fonctionnelles
- [ ] Workflow d'onboarding testé de bout en bout
- [ ] Paiement Stripe fonctionnel (mode test puis production)
- [ ] Webhook Stripe configuré et testé
- [ ] Création client dans Airtable testée
- [ ] Upload signature S3 testé
- [ ] Logs PM2 sans erreurs critiques
- [ ] Backup initial créé
- [ ] Documentation technique à jour
- [ ] Contacts d'urgence notés

---

## Contacts Support

**Hébergement SwissCenter** : support@swisscenter.ch  
**Stripe Support** : https://support.stripe.com  
**Airtable Support** : https://support.airtable.com  
**Développement** : Manus AI  
**Client** : Olivier Neukomm - contact@winwin.swiss - 032 466 11 00

---

**Félicitations ! Le site WIN WIN Finance Group est maintenant en ligne ! 🎉**
