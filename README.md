# SecureVault

A premium, secure-feeling personal password manager: store, search, and generate credentials and other sensitive items behind a local master-password vault.

SecureVault is a **local-only prototype** in this version. Your items, settings and audit trail live on the device in your browser's local storage — nothing is sent to a server, and backend sync, sharing and organizations are out of scope. Master passwords are stored as an unrecoverable hash so they can never be retrieved. The app is a prototype and is not marketed as production-secure.

## Setup

```bash
npm install
npm run dev
```

`.env` at the workspace root carries the public `VITE_BLOCKS_*` values the build bakes in at build time (`VITE_BLOCKS_API_URL`, `VITE_BLOCKS_X_BLOCKS_KEY`, `VITE_BLOCKS_APP_DOMAIN`), plus the `VITE_BLOCKS_DEV_HOST` / `VITE_BLOCKS_DEV_PORT` used by the local dev server. Only public values belong here; never commit a secret.

## Using the app

- **First run** — create your vault with a master password (confirm it, and acknowledge it can't be recovered).
- **Sign in** — unlock the vault with your email and master password (or a passkey alternative).
- **Vault** — add, edit, view, copy, favorite, trash, restore and permanently delete items across types (Login, Credit Card, Identity, Secure Note, Wi-Fi, Bank Account, API Key).
- **Search** — find items live across name, username, website, category and notes.
- **Generator** — create strong random passwords and word-based passphrases.
- **Security** — a checkup score and findings derived from your vault items, plus an illustrative (mocked) breach monitor.

## Release deployment

The scaffold includes `Dockerfile` and `nginx.conf` for deployment. The Release service must pass Docker build arg `ci_build=<environment>` plus the public `VITE_BLOCKS_*` build args documented in the Dockerfile. The generated `package.json` also provides `build:dev` through `build:prod` scripts for environment checks. During each environment build, `scripts/write-release-env.mjs` writes `dist/env.<environment>` from client-safe Docker build args or local `.env` files. Root `.env` remains gitignored.

## What's included

- First-time vault setup and master-password unlock/sign-out flow.
- Vault list with search, sort, category filter, grid/list views, favorites, recent, and trash.
- Item detail panel with masked passwords, reveal and copy-to-clipboard feedback.
- Password generator and passphrase mode.
- Security checkup and breach monitor (mocked data only).
- Settings (theme Light/Dark/System functions; language and other options stored or marked unavailable) and Profile.
- Light and dark themes across desktop (three-column), tablet (drawer) and mobile (bottom navigation bar) layouts.