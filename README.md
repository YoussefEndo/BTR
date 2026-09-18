# BTR Immobilier Déco — Mobilier sur mesure

Application web MVP pour un commerce marocain de mobilier et d'aménagement
intérieur sur mesure. Les clients configurent un produit (dimensions, couleurs,
finitions...), laissent leurs coordonnées : la commande est enregistrée dans
Supabase puis un message WhatsApp pré-rempli est ouvert vers le commerce.
**Aucun prix n'est affiché** — le devis se négocie sur WhatsApp.

## Stack technique

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript** strict
- **Tailwind CSS v4**
- **Supabase** : PostgreSQL, Storage, Auth, RLS
- **WhatsApp click-to-chat** (`wa.me`) — pas d'API WhatsApp Business
- **Vercel** pour le déploiement

## Installation

```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev
```

Ouvrir http://localhost:3000

## Variables d'environnement

Créer `.env.local` à partir de `.env.example` :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (Dashboard → Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé `anon` publique du projet |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp du commerce, format international **sans** `+` ni espaces (ex : `2126XXXXXXXX`) |

⚠️ Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` — elle n'est pas utilisée par
cette application.

## Configuration Supabase

### 1. Créer le projet

Créer un projet sur [supabase.com](https://supabase.com), puis récupérer l'URL
et la clé `anon` dans **Settings → API**.

### 2. Appliquer les migrations

Option A — CLI Supabase (recommandé) :

```bash
npm install -D supabase        # déjà présent
npx supabase login
npx supabase link --project-ref <votre-project-ref>
npx supabase db push           # applique supabase/migrations dans l'ordre
```

Option B — manuel : dans le **SQL Editor** du dashboard Supabase, exécuter les
fichiers **dans l'ordre** :

1. `supabase/migrations/0001_schema.sql` — tables, clés étrangères, index, trigger
2. `supabase/migrations/0002_rls_storage.sql` — RLS, policies, bucket `product-images`
3. `supabase/migrations/0003_seed.sql` — données de démonstration

### 3. Compte administrateur

Dans le dashboard Supabase : **Authentication → Users → Add user**.
Créer un utilisateur avec email + mot de passe. Cet utilisateur pourra se
connecter sur `/login` et accéder à `/admin`.

## Développement local

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm run lint    # ESLint
npx tsc --noEmit # vérification TypeScript
```

## Déploiement Vercel

1. Pousser le code sur GitHub.
2. Importer le repo sur [vercel.com](https://vercel.com).
3. Ajouter les 3 variables d'environnement (cf. tableau ci-dessus) dans
   **Settings → Environment Variables**.
4. Déployer.

## Configuration WhatsApp

Le numéro est lu depuis `NEXT_PUBLIC_WHATSAPP_NUMBER`. Le message de demande de
devis est généré dans `lib/whatsapp.ts` puis encodé dans une URL
`https://wa.me/<numéro>?text=<message>`. Aucune API payante.

## Structure du projet

```
app/
  page.tsx                 # Accueil
  products/                # Liste + détail produit (/products/[slug])
  categories/[slug]/       # Page catégorie
  actions/orders.ts        # Server action : enregistrement des commandes
  login/                   # Connexion admin
  admin/                   # Dashboard protégé (produits, catégories, commandes)
components/
  layout/                  # Navbar, Footer
  products/ categories/    # Cartes produits / catégories
  order/                   # Formulaire de commande dynamique
  admin/                   # Managers CRUD
lib/
  supabase/                # Clients Supabase (server, browser)
  queries/                 # Requêtes catalogues
  whatsapp.ts              # Génération du message + URL wa.me
  validation/              # Validation partagée client/serveur
supabase/migrations/       # SQL reproductible (schéma, RLS, seed)
types/database.ts          # Types métier
```

## Notes importantes

- **Sécurité** : RLS activée sur toutes les tables. Le public peut lire le
  catalogue actif et insérer une commande (status forcé à `pending`).
  L'admin authentifié a un accès complet. Les valeurs d'options sont
  revalidées côté serveur.
- **Données de démo** : les produits/catégories du seed sont fictifs avec des
  images placeholder (picsum.photos). Remplacez-les depuis l'admin.
- **Langue** : interface en français. Une structure i18n légère peut être
  ajoutée plus tard pour l'arabe/darija.
