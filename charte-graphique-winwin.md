# Charte Graphique WIN WIN Finance Group

## 🎨 Codes Couleurs Officiels

### Bleu Principal (Foncé)
- **CMJN** : C:80, M:40, J:10, N:15
- **RVB** : R:49, V:118, B:166
- **HEX** : `#3176A6`

### Bleu Clair (Secondaire)
- **CMJN** : C:50, M:20, J:10, N:0
- **RVB** : R:140, V:180, B:210
- **HEX** : `#8CB4D2`

---

## 🔤 Polices Officielles

### Police Principale
**Kozuka Gothic PR6N B (Gras)**
- Utilisation : Titres, éléments importants
- Téléchargement : www.dafont.com

### Police Secondaire
**Kozuka Gothic PR6N L (Léger)**
- Utilisation : Textes courants, paragraphes

---

## 📐 Logo

### Proportions
- Hauteur du "WW" : X
- Hauteur de la bande "WINWIN FINANCE GROUP" : X/5
- Largeur de la bande : proportionnelle au texte

### Composition
- **Symbole** : "WW" stylisé avec flèche ascendante (croissance)
  - Premier "W" : Bleu foncé (#3176A6)
  - Second "W" : Bleu clair (#8CB4D2)
  - Flèche : Bleu clair (#8CB4D2)
- **Texte** : "WINWIN FINANCE GROUP" sur bande bleue
  - "WINWIN" : Bleu foncé (#3176A6)
  - "FINANCE GROUP" : Bleu clair (#8CB4D2)

---

## 🎯 Utilisation sur le Site

### Couleurs Actuelles (Tailwind)
```css
/* Déjà configuré dans index.css */
--primary: #3176A6;      /* Bleu principal */
--secondary: #8CB4D2;    /* Bleu clair */
--accent: #D4AF37;       /* Doré (ajouté pour accents) */
```

### Logo
- Fichier : `/client/public/logo_WinWin_2016.jpg`
- Référence : `APP_LOGO` dans `/client/src/const.ts`

---

## 📄 Application au PDF Mandat de Gestion

### En-tête
- Fond : Bleu principal (#3176A6)
- Texte : Blanc
- Titre : "WIN WIN" (pas "WW")
- Sous-titre : "MANDAT DE GESTION DE PORTEFEUILLE D'ASSURANCES"

### Corps
- Titres sections : Bleu principal (#3176A6)
- Texte : Noir (#000000)
- Bordures : Bleu clair (#8CB4D2)

### Police PDF
- Helvetica Bold pour titres
- Helvetica pour texte courant
- (Kozuka Gothic non disponible dans pdf-lib, utiliser Helvetica comme fallback)
