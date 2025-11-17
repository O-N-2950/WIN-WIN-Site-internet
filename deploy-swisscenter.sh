#!/bin/bash

# Script de déploiement automatisé pour SwissCenter
# WIN WIN Finance Group - www.winwin.swiss

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement automatisé sur SwissCenter"
echo "=========================================="
echo ""

# Variables
PROJECT_DIR="/home/ubuntu/winwin-website"
DEPLOY_DIR="/home/ubuntu/winwin-deploy"
FTP_HOST="ftp.swisscenter.com"
FTP_USER="winwinpr"
FTP_PASS="One4youOne4you11+"
REMOTE_DIR="/winwin.swiss"

# Étape 1: Créer le répertoire de déploiement
echo "📦 Étape 1/5: Préparation du package..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Étape 2: Copier les fichiers nécessaires
echo "📋 Étape 2/5: Copie des fichiers de production..."
cd "$PROJECT_DIR"

# Copier le build
cp -r dist/* "$DEPLOY_DIR/"

# Copier les dépendances nécessaires
cp package.json "$DEPLOY_DIR/"
cp pnpm-lock.yaml "$DEPLOY_DIR/" 2>/dev/null || true

# Copier les fichiers de configuration
cp -r server "$DEPLOY_DIR/" 2>/dev/null || true
cp -r shared "$DEPLOY_DIR/" 2>/dev/null || true
cp -r drizzle "$DEPLOY_DIR/" 2>/dev/null || true

# Créer le fichier .env pour production
cat > "$DEPLOY_DIR/.env" << 'EOF'
# Variables d'environnement - SwissCenter Production
NODE_ENV=production
PORT=3000

# Base de données (à configurer)
DATABASE_URL=mysql://user:password@localhost:3306/winwin_db

# Stripe Production
STRIPE_SECRET_KEY=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
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S4IHpClI3EKhVGDGJHdLvmJVKfvUBz3zGMGhKEqVPJQJZLJEqVPJQJZLJEqVPJQJZLJEqVPJQJZ
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

# Resend Email
RESEND_API_KEY=re_HR7NoB76_JDdR2wq7cPvxaDbdd7JdTCHJ

# Airtable
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX

# AWS S3
AWS_ACCESS_KEY_ID=XXXXX
AWS_SECRET_ACCESS_KEY=XXXXX
AWS_REGION=eu-central-1
AWS_BUCKET_NAME=winwin-signatures

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# Application
VITE_APP_TITLE=WIN WIN Finance Group
VITE_APP_LOGO=/logo-winwin-official.jpg
EOF

# Créer le fichier de démarrage PM2
cat > "$DEPLOY_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'winwin-website',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Créer le fichier README pour le serveur
cat > "$DEPLOY_DIR/README-DEPLOY.md" << 'EOF'
# Déploiement WIN WIN Finance Group

## Installation sur le serveur

1. Installer Node.js 22.x:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Installer pnpm et PM2:
```bash
npm install -g pnpm pm2
```

3. Installer les dépendances:
```bash
cd /path/to/winwin-website
pnpm install --prod
```

4. Configurer les variables d'environnement:
```bash
nano .env
# Remplir toutes les variables
```

5. Démarrer l'application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. Vérifier le statut:
```bash
pm2 status
pm2 logs winwin-website
```

## Configuration Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name winwin.swiss www.winwin.swiss;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Commandes utiles

- Redémarrer: `pm2 restart winwin-website`
- Arrêter: `pm2 stop winwin-website`
- Logs: `pm2 logs winwin-website`
- Monitoring: `pm2 monit`
EOF

echo "✅ Package créé dans: $DEPLOY_DIR"
echo ""

# Étape 3: Créer l'archive
echo "📦 Étape 3/5: Création de l'archive..."
cd "$DEPLOY_DIR"
tar -czf ../winwin-deploy.tar.gz .
echo "✅ Archive créée: /home/ubuntu/winwin-deploy.tar.gz"
echo ""

# Étape 4: Information sur le déploiement FTP
echo "📤 Étape 4/5: Préparation du déploiement FTP..."
echo ""
echo "⚠️  IMPORTANT: Configuration FTP requise"
echo "==========================================="
echo ""
echo "L'archive est prête à être uploadée sur SwissCenter."
echo ""
echo "Informations de connexion FTP:"
echo "  Hôte: $FTP_HOST"
echo "  Utilisateur: $FTP_USER"
echo "  Répertoire distant: $REMOTE_DIR"
echo ""
echo "Fichier à uploader:"
echo "  /home/ubuntu/winwin-deploy.tar.gz"
echo ""

# Étape 5: Résumé
echo "✅ Étape 5/5: Déploiement préparé avec succès!"
echo ""
echo "📋 PROCHAINES ÉTAPES SUR LE SERVEUR SWISSCENTER:"
echo "================================================"
echo ""
echo "1. Uploader winwin-deploy.tar.gz via FTP/SFTP"
echo "2. Se connecter en SSH au serveur"
echo "3. Extraire l'archive:"
echo "   cd /path/to/winwin.swiss"
echo "   tar -xzf winwin-deploy.tar.gz"
echo ""
echo "4. Installer les dépendances:"
echo "   pnpm install --prod"
echo ""
echo "5. Configurer .env avec les vraies clés API"
echo ""
echo "6. Démarrer avec PM2:"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo ""
echo "7. Configurer le reverse proxy Nginx"
echo ""
echo "🎉 Le site sera accessible sur www.winwin.swiss"
echo ""
