#!/usr/bin/env python3
"""
Script de vérification orthographique pour Talentis.tsx et Durabilis.tsx
"""

import re

# Fautes courantes à détecter
CORRECTIONS = {
    "survirants": "survivants",
    "assuré": "assuré",  # vérifier les accents
    "employé": "employé",
    "prévoyance": "prévoyance",
    "décès": "décès",
    "bénéficiaire": "bénéficiaire",
    "fiscalité": "fiscalité",
    "sécurité": "sécurité",
    "pérennité": "pérennité",
    "héritiers": "héritiers",
    "stratégie": "stratégie",
    "fidélisation": "fidélisation",
}

def check_file(filepath):
    """Vérifie un fichier et retourne les fautes trouvées"""
    print(f"\n📄 Vérification de {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    errors = []
    
    # Recherche de fautes courantes
    common_errors = [
        (r'\bsurvirants\b', 'survivants'),
        (r'\bpérénité\b', 'pérennité'),
        (r'\bfidélisaton\b', 'fidélisation'),
        (r'\bstratégie\b', 'stratégie'),
        (r'\bhéritier\b(?!s)', 'héritiers (pluriel?)'),
        (r'\bassocié\b(?!s)', 'associés (pluriel?)'),
        (r'\bemployé\b(?!s)', 'employés (pluriel?)'),
    ]
    
    for line_num, line in enumerate(lines, 1):
        # Ignorer les lignes de code (import, const, etc.)
        if line.strip().startswith(('import', 'const', 'export', '//', '/*', '*')):
            continue
            
        for pattern, suggestion in common_errors:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for match in matches:
                errors.append({
                    'line': line_num,
                    'text': line.strip()[:80],
                    'error': match.group(),
                    'suggestion': suggestion
                })
    
    return errors

def main():
    files = [
        '/home/ubuntu/winwin-website/client/src/pages/Talentis.tsx',
        '/home/ubuntu/winwin-website/client/src/pages/Durabilis.tsx'
    ]
    
    all_errors = {}
    
    for filepath in files:
        errors = check_file(filepath)
        if errors:
            all_errors[filepath] = errors
    
    # Affichage des résultats
    if all_errors:
        print("\n❌ FAUTES DÉTECTÉES:\n")
        for filepath, errors in all_errors.items():
            print(f"📁 {filepath.split('/')[-1]}:")
            for err in errors:
                print(f"  Ligne {err['line']}: '{err['error']}' → {err['suggestion']}")
                print(f"    {err['text']}")
        print(f"\n✅ Total: {sum(len(e) for e in all_errors.values())} faute(s) trouvée(s)")
    else:
        print("\n✅ Aucune faute détectée!")

if __name__ == '__main__':
    main()
