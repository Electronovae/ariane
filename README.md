# Ariane 🧵

Un tableau de liège numérique pour organiser ses projets.

Canvas infini avec post-its en Markdown, connexions sémantiques entre projets, multi-tableaux, sauvegarde automatique et export/import JSON.

**[Ouvrir Ariane](https://electronovae.github.io/ariane/)**

## Utilisation

| Action | Effet |
|---|---|
| Double-clic sur le liège | Créer un post-it |
| Double-clic sur un post-it | Éditer (Markdown, titre, couleur) |
| Glisser un handle (bord du post-it) | Relier deux post-its |
| Double-clic sur un lien | Supprimer le lien |
| Double-clic sur un onglet | Renommer le tableau |
| Ctrl+S ou Échap dans l'éditeur | Sauvegarder et fermer |

### Types de liens

- **Dépend de** : lien de dépendance (rouge)
- **Sous-projet** : hiérarchie de projets (bleu)
- **Lié à** : association libre (gris)

### Données

Les données sont sauvegardées automatiquement dans le navigateur (localStorage). Utilisez **Exporter** pour sauvegarder un fichier JSON et **Importer** pour le restaurer ou le partager.

## Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Flow](https://reactflow.dev/) — canvas de nœuds
- [Zustand](https://zustand-demo.pmnd.rs/) — état global
- [marked](https://marked.js.org/) — rendu Markdown
- [Tailwind CSS](https://tailwindcss.com/)

## Développement local

```bash
git clone https://github.com/Electronovae/ariane.git
cd ariane
npm install
npm run dev
```

## Déploiement

Push sur `main` → GitHub Actions build et déploie automatiquement sur GitHub Pages.

Prérequis : Settings > Pages > Source : **GitHub Actions**.

## Licence

MIT
