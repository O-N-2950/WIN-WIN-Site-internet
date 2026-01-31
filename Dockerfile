FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Revenir en root pour installer pnpm
USER root

# Installer pnpm
RUN npm install -g pnpm

# Créer le répertoire de travail
WORKDIR /app

# Copier tout le code
COPY --chown=pptruser:pptruser . .

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm run build

# Exposer le port
EXPOSE 8080

# Revenir à l'utilisateur pptruser
USER pptruser

# Lancer l'app
CMD ["pnpm", "start"]
