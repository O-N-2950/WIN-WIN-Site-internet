FROM node:20-slim

# Installer Chromium et toutes les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurer Puppeteer pour utiliser Chromium installé
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier TOUT le code (y compris patches/) AVANT pnpm install
COPY . .

# Installer les dépendances (patches/ est maintenant disponible)
RUN pnpm install --frozen-lockfile

# Build du projet
RUN pnpm run build

# Exposer le port
EXPOSE 8080

# Démarrer l'application
CMD ["pnpm", "start"]
