# Ringover Technical Test

Application front-end (Nuxt 4 + TypeScript) avec affichage de contacts, tri, recherche, filtres et pagination/infinite scroll.

## Stack

- **Nuxt 4**
- **TypeScript**
- **Vitest** + `@vue/test-utils`
- **Vite**

---

## Démarrage rapide

### Prérequis

- **Node.js** 24+ (recommandé : LTS)
- **npm** 11+

### Installation

```bash
pnpm install
```

### Lancer en développement

```bash
pnpm run dev
```

Application disponible sur : `http://localhost:3000`

### Build de production

```bash
pnpm run build
pnpm run preview
```

---

## Tests

### Exécuter tous les tests

```bash
pnpm run test
```

## Structure du projet

```txt
app/
  components/
    section/
      ContactsSection.vue
      ContactsTable.vue
server/
  api/
    contacts.get.ts
tests/
  api/
    contacts.test.ts
    ContactsTable.test.ts
types/
```

---

## API locale

### `GET /api/contacts`

Retourne une liste paginée de contacts.

#### Query params supportés

- `page` (number)
- `limit` (number)
- `search` (string)
- `sortBy` (string)
- `sortDir` (`asc` | `desc`)
- `status` (string)
- `country` (string)
- `company` (string)

#### Exemple

```http
GET /api/contacts?page=1&limit=20&search=emma&sortBy=lastName&sortDir=asc
```

---

## Décisions techniques

- Utilisation de modules: @nuxt/image, nuxt-security, nuxt-svgo.
- Utilisation de `@nuxt/i18n` pour un site multilangue
- Fichiers `scss` pour avoir une architecture css globale et réutilisable
- Tests Lighthouse pour performances, accessibilité, SEO et bonnes pratiques
- Chargement progressif via sentinel (`IntersectionObserver`).
- Tests API basés sur mock d’event H3 (`node.req.url`).
- Alias Vite/Vitest alignés pour `@` et `~` vers `app/`.

---

## Scripts utiles

```json
{
  "dev": "nuxt dev",
  "build": "nuxt build",
  "preview": "nuxt preview",
  "test": "vitest run"
}
```

## Dark Mode

L'implémentation des modes Sombre et Clair impliquent trois étapes majeures:

- Ajouter des couleurs dans `_colors.scss` pour chaque élément
- Les rendre dynamiques en les ajoutant dans l'élément `:root` de l'application
- Ajouter un bouton dans le header qui active/désactive la classe `"theme-dark"` sur le `body`

## Nota Bene

J'ai volontairement changé la couleur du tag "Proposal" car la couleur de la maquette ne proposait pas un contraste suffisant.
