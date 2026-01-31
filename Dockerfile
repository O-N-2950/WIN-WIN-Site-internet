FROM node:20-slim

# Installer Chromium et toutes les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    chromium \
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

# Trouver et afficher le chemin de Chromium
RUN echo "=== Recherche de Chromium ===" && \
    which chromium && echo "Chromium trouvé via 'which chromium'" || \
    which chromium-browser && echo "Chromium trouvé via 'which chromium-browser'" || \
    find /usr -name chromium 2>/dev/null | head -1 && echo "Chromium trouvé via 'find'" || \
    echo "ATTENTION: Chromium non trouvé !"

# Configurer Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier TOUT le code (y compris patches/)
COPY . .

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Build du projet
RUN pnpm run build

# Exposer le port
EXPOSE 8080

# Démarrer l'application
CMD ["pnpm", "start"]
