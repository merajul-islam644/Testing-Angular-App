# SecureVault — build plan

Local-only single-user prototype per the PRD (backend sync, sharing, orgs,
real MFA/passkey, breach detection all explicitly "not in this version").
Every server-backed Blocks capability is out of scope or mocked, so these
items are plain UI + local state (no skill); the one store is the local vault.

- [x] Local vault store: items, settings, audit trail (no skill — PRD explicitly local-only)
- [x] First-time setup, unlock sign-in, sign-out (no skill — app-embedded auth per PRD)
- [x] Vault All Items list + empty state + New/Edit item modal (no skill)
- [x] Item detail panel: masked password, reveal, copy (no skill)
- [x] Live search, sort, category filter (no skill)
- [x] Favorites, Recent, Trash, restore, permanent delete (no skill)
- [x] Password generator + passphrase mode (no skill)
- [x] Security dashboard + mocked breach monitor (no skill — SD-03 mocked)
- [x] Settings and profile screens with sign out (no skill)
- [x] Check and build app