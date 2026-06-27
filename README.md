# Ariane 🧵

Un tableau de liège numérique pour organiser vos projets.

Canvas infini avec post-its en Markdown, connexions sémantiques entre projets (dépendance, sous-projet, lié à), multi-tableaux, sauvegarde automatique et export/import JSON.

## Utilisation

- **Double-clic sur le liège** : créer un post-it
- **Double-clic sur un post-it** : éditer (Markdown, titre, couleur)
- **Glisser un handle** : relier deux post-its avec un lien typé
- **Double-clic sur un lien** : le supprimer
- **Double-clic sur un onglet** : renommer le tableau

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Push sur `main` → GitHub Actions déploie automatiquement sur GitHub Pages.

Configurer dans Settings > Pages > Source : **GitHub Actions**.
