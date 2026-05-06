# speciesa-mobile

React Native + Expo mobile app for the Speciesa biological atlas.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env: set EXPO_PUBLIC_API_URL to your backend URL

# 3. Start development server
npx expo start

# 4. Open on device
# → Press i for iOS Simulator
# → Press a for Android Emulator
# → Scan QR code with Expo Go app on physical device
```

## Commands

```bash
make start         # Start Expo dev server
make ios           # Open in iOS Simulator
make android       # Open in Android Emulator
make test          # Run Jest tests
make test-watch    # Run tests in watch mode
make lint          # ESLint
make typecheck     # TypeScript check
make build-preview # EAS build (preview profile)
make build-prod    # EAS build (production profile)
make submit-prod   # EAS submit to App Store + Google Play
```

## Project structure

```
src/
├── app/                  ← Expo Router screens (file-based routing)
│   ├── (tabs)/           ← Bottom tab screens
│   │   ├── index.tsx     ← Home
│   │   ├── catalog.tsx   ← Taxonomy drill-down catalog
│   │   ├── search.tsx    ← Search
│   │   ├── favorites.tsx ← Saved collections
│   │   └── profile.tsx   ← User profile + settings
│   ├── taxon/[id].tsx    ← Species/taxon card
│   ├── premium.tsx       ← Premium paywall (modal)
│   └── auth/
│       ├── login.tsx
│       └── register.tsx
├── components/           ← Reusable UI components
├── hooks/
│   └── useApi.ts         ← React Query hooks for all API calls
├── i18n/
│   ├── index.ts          ← i18n setup
│   └── locales/
│       ├── ru.ts         ← Russian strings
│       └── en.ts         ← English strings
├── lib/
│   ├── api.ts            ← Axios client + auth interceptors
│   └── storage.ts        ← MMKV singleton
├── store/
│   └── authStore.ts      ← Zustand auth state
└── types/
    └── index.ts          ← TypeScript types + constants
```

## Routing (Expo Router)

```
/                    → Home tab
/catalog             → Catalog (drill-down, accepts taxon_id param)
/search              → Search tab
/favorites           → Favorites tab
/profile             → Profile tab
/taxon/:id           → Species/taxon card (stack)
/premium             → Premium paywall (modal)
/auth/login          → Login (modal)
/auth/register       → Register (modal)
```

## API connection

The app connects to the backend via `EXPO_PUBLIC_API_URL` environment variable.

- Development: `http://localhost:8000/v1`
- Production: `https://api.speciesa.app/v1`

Auth tokens are stored in MMKV encrypted storage. The Axios interceptor
auto-refreshes the access token when it expires (401 response).

## EAS Build (for stores)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for internal testing
eas build --platform all --profile preview

# Build for production
eas build --platform all --profile production

# Submit to stores (requires store credentials in eas.json)
eas submit --platform all --profile production
```

## GitHub Actions secrets required

| Secret | Value |
|--------|-------|
| `EXPO_TOKEN` | Expo access token (from expo.dev) |
