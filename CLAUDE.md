# speciesa-mobile — Claude Code Guide

## What is this?

React Native + Expo (TypeScript) mobile app for **Speciesa** — a biological atlas.
Targets iOS + Android from one codebase. Uses Expo Router (file-based navigation).

## How to run locally

```bash
npm install
cp .env.example .env              # set EXPO_PUBLIC_API_URL
npx expo start                    # start dev server
# press i → iOS Simulator
# press a → Android Emulator
# scan QR → Expo Go on phone
```

## Key commands

```bash
make start         # expo start
make ios           # iOS simulator
make android       # Android emulator
make test          # jest
make lint          # eslint
make typecheck     # tsc --noEmit
make build-preview # eas build --profile preview
make build-prod    # eas build --profile production
```

## Architecture

```
src/
├── app/                          ← Expo Router screens (file = route)
│   ├── _layout.tsx               ← Root layout: QueryClientProvider + Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx           ← Bottom tab navigator
│   │   ├── index.tsx             ← Home screen
│   │   ├── catalog.tsx           ← Taxonomy drill-down (Kingdom → Species)
│   │   ├── search.tsx            ← Full-text search
│   │   ├── favorites.tsx         ← User collections
│   │   └── profile.tsx           ← Auth state + settings
│   ├── taxon/[id].tsx            ← Species/taxon card
│   ├── premium.tsx               ← Premium paywall (modal)
│   └── auth/
│       ├── login.tsx             ← Login modal
│       └── register.tsx          ← Register modal
├── components/                   ← Reusable UI components
│   ├── ui/                       ← Generic: Button, Card, Badge, Skeleton
│   ├── taxonomy/                 ← TaxonRow, BreadcrumbBar, RankPill
│   ├── species/                  ← SpeciesHero, AttributeGrid, ClassifTable
│   └── search/                   ← SearchBar, SearchResultRow
├── hooks/
│   └── useApi.ts                 ← All React Query hooks (taxa, search, auth...)
├── lib/
│   ├── api.ts                    ← Axios client + JWT interceptors
│   ├── storage.ts                ← MMKV singleton
│   └── offline/
│       ├── db.ts                 ← SQLite database setup
│       ├── packManager.ts        ← Download, store, read offline packs
│       └── queries.ts            ← SQLite query helpers
├── store/
│   └── authStore.ts              ← Zustand: user, tokens, premium state
├── i18n/
│   ├── index.ts                  ← i18n-js setup
│   └── locales/
│       ├── ru.ts                 ← Russian strings (default)
│       └── en.ts                 ← English strings
└── types/
    └── index.ts                  ← All TypeScript types + constants
```

## Routing

```
/                     → (tabs)/index.tsx     Home
/catalog              → (tabs)/catalog.tsx   Catalog (params: taxon_id, rank, breadcrumb)
/search               → (tabs)/search.tsx    Search
/favorites            → (tabs)/favorites.tsx Favorites
/profile              → (tabs)/profile.tsx   Profile
/taxon/:id            → taxon/[id].tsx       Species card
/premium              → premium.tsx          Paywall (modal)
/auth/login           → auth/login.tsx       Login (modal)
/auth/register        → auth/register.tsx    Register (modal)
```

## State management

- **Server state**: React Query (TanStack Query) — all API calls in `src/hooks/useApi.ts`
- **Auth state**: Zustand (`src/store/authStore.ts`) — user, tokens, premium flag
- **Tokens**: MMKV encrypted storage — `access_token`, `refresh_token`
- **Offline data**: SQLite via expo-sqlite (`src/lib/offline/db.ts`)

## Critical rules

- **Never use `localStorage`** — not available in React Native. Use MMKV.
- **Never use inline styles** for shared patterns — extract to StyleSheet
- All user-visible strings go through `t('key')` from `src/i18n` — never hardcode Russian text in JSX
- All API calls go through React Query hooks in `useApi.ts` — never call `api.get()` directly in components
- Offline reads fall back gracefully: check SQLite first if pack is downloaded, then API
- `is_published` filtering is handled by the API — don't filter on the client

## Environment variables

```
EXPO_PUBLIC_API_URL=http://localhost:8000/v1    # development
EXPO_PUBLIC_API_URL=https://api.speciesa.app/v1 # production
```

## Offline architecture

When a user downloads an offline pack:
1. Fetch manifest from `/v1/packs/{id}/manifest`
2. Download all taxa JSON → insert into SQLite (`taxa` table)
3. Download images → save to `FileSystem.documentDirectory/speciesa/packs/{id}/images/`
4. Mark pack as downloaded in MMKV: `pack_downloaded_{id}=true`

Reading offline: `src/lib/offline/queries.ts` checks MMKV for downloaded packs,
then queries SQLite instead of the API.

## Adding a new screen

1. Create file in `src/app/` — filename becomes the route
2. Export default React component
3. Add any needed React Query hook to `src/hooks/useApi.ts`
4. Add i18n strings to both `locales/ru.ts` and `locales/en.ts`
5. Add TypeScript types to `src/types/index.ts` if needed

## Testing

```bash
npm test                    # all tests
npm test -- --testPathPattern=basic  # specific file
npm test -- --coverage      # with coverage
```

Mocks: MMKV is mocked in `tests/`. expo-sqlite mock in `__mocks__/`.

## Build for stores

```bash
# Requires: eas-cli installed + expo.dev account
eas login
eas build --platform all --profile production
eas submit --platform all --profile production
```

Fill in `eas.json` with your Apple ID and Google service account before submitting.

## Next tasks (priority order)

1. `M-23/24` — Offline pack download manager (`src/lib/offline/packManager.ts`)
2. `M-25` — SQLite offline reads in catalog + species card
3. `M-29/30` — In-app purchases (StoreKit / Google Play Billing)
4. Extract reusable components from screens into `src/components/`
5. `M-36` — Loading skeletons on all list screens
