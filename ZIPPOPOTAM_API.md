# API Zippopotam.us - Notes d'intégration

## Endpoint pour la Suisse

**Base URL:** `https://api.zippopotam.us`

### 1. Recherche par NPA (Code postal)
```
GET /CH/{npa}
```

**Exemple:** `https://api.zippopotam.us/CH/2950`

**Réponse JSON:**
```json
{
  "post code": "2950",
  "country": "Switzerland",
  "country abbreviation": "CH",
  "places": [
    {
      "place name": "Courgenay",
      "longitude": "7.1167",
      "state": "Jura",
      "state abbreviation": "JU",
      "latitude": "47.4"
    }
  ]
}
```

### 2. Recherche par Localité
```
GET /CH/{state}/{place}
```

**Exemple:** `https://api.zippopotam.us/CH/JU/Courgenay`

**Note:** Nécessite le code du canton (state abbreviation)

## Caractéristiques

- ✅ **Gratuit** : Pas de clé API requise
- ✅ **CORS activé** : Utilisable directement depuis le frontend
- ✅ **Pas de limite** : Unrestricted usage
- ✅ **Rapide** : Lightning fast
- ⚠️ **Données GeoNames** : Fourni "as-is" sans garantie d'exactitude

## Implémentation pour WIN WIN

### Cas d'usage 1 : NPA → Localité
1. Utilisateur tape "2950" dans le champ NPA
2. Appel API : `GET /CH/2950`
3. Récupérer `places[0]["place name"]` → "Courgenay"
4. Remplir automatiquement le champ Localité

### Cas d'usage 2 : Localité → NPA
**PROBLÈME** : L'API nécessite le code du canton pour rechercher par localité.
**SOLUTION** : Utiliser uniquement NPA → Localité (plus simple et plus fiable)

## Gestion des erreurs

- **404** : NPA invalide ou non trouvé
- **Network error** : API indisponible
- **Multiple places** : Certains NPA peuvent avoir plusieurs localités (rare en Suisse)

## Recommandation

**Implémenter uniquement NPA → Localité** car :
- Plus simple (1 seul endpoint)
- Plus fiable (pas besoin du canton)
- Correspond au workflow naturel (l'utilisateur connaît son NPA)
