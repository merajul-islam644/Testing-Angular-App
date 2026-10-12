import { useSyncExternalStore } from "react";

export type ItemType =
  | "Login"
  | "Credit Card"
  | "Identity"
  | "Secure Note"
  | "Wi-Fi"
  | "Bank Account"
  | "API Key";

export type Category =
  | "Personal"
  | "Work"
  | "Finance"
  | "Social"
  | "Development"
  | "Entertainment"
  | "Other";

export const ITEM_TYPES: ItemType[] = ["Login", "Credit Card", "Identity", "Secure Note", "Wi-Fi", "Bank Account", "API Key"];
export const CATEGORIES: Category[] = ["Personal", "Work", "Finance", "Social", "Development", "Entertainment", "Other"];

export type VaultItem = {
  id: string;
  name: string;
  type: ItemType;
  username: string;
  password: string;
  website: string;
  notes: string;
  category?: Category;
  favorite: boolean;
  deleted: boolean;
  deletedAt?: number;
  lastModified: number;
  createdAt: number;
};

export type Settings = {
  theme: "light" | "dark" | "system";
  language: "en";
  defaultCategory?: Category;
  sessionTimeout: number;
};

export type AuditEntry = {
  id: string;
  at: number;
  who: string;
  action: string;
  itemName: string;
};

export type VaultState = {
  items: VaultItem[];
  audit: AuditEntry[];
  createdAt: number;
};

export type VaultData = {
  state: VaultState;
  salt: string;
  hash: string;
  email: string;
};

const ITEMS_KEY = "securevault:vault";
const SETTINGS_KEY = "securevault:settings";
const UNLOCK_KEY = "securevault:unlocked";

const emptyState: VaultState = { items: [], audit: [], createdAt: 0 };

let cachedData: VaultData | null = null;
let cachedSettings: Settings | null = null;
const listeners = new Set<() => void>();

function readData(): VaultData | null {
  if (cachedData) return cachedData;
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    cachedData = raw ? (JSON.parse(raw) as VaultData) : null;
  } catch {
    cachedData = null;
  }
  return cachedData;
}

function readState(): VaultState {
  return readData()?.state ?? emptyState;
}

function writeState(state: VaultState): void {
  const data = readData();
  if (data) {
    cachedData = { ...data, state };
    localStorage.setItem(ITEMS_KEY, JSON.stringify(cachedData));
  }
  emit();
}

function emit(): void {
  for (const listener of listeners) listener();
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function recordAudit(state: VaultState, action: string, itemName: string): VaultState {
  const entry: AuditEntry = { id: makeId(), at: Date.now(), who: "owner", action, itemName };
  return { ...state, audit: [entry, ...state.audit].slice(0, 500) };
}

function touch(item: VaultItem): VaultItem {
  return { ...item, lastModified: Date.now() };
}

export const vaultStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): VaultState {
    return readState();
  }
};

export const settingsStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): Settings {
    if (cachedSettings) return cachedSettings;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      cachedSettings = raw
        ? (JSON.parse(raw) as Settings)
        : { theme: "system", language: "en", sessionTimeout: 30 };
    } catch {
      cachedSettings = { theme: "system", language: "en", sessionTimeout: 30 };
    }
    return cachedSettings;
  },
  save(patch: Partial<Settings>): void {
    const next = { ...settingsStore.getSnapshot(), ...patch };
    cachedSettings = next;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    emit();
  }
};

export function useVault(): VaultState {
  return useSyncExternalStore(vaultStore.subscribe, vaultStore.getSnapshot);
}

export function useSettings(): Settings {
  return useSyncExternalStore(settingsStore.subscribe, settingsStore.getSnapshot);
}

export function addItem(input: Omit<VaultItem, "id" | "createdAt" | "lastModified" | "deleted" | "deletedAt" | "favorite">): void {
  const state = readState();
  const now = Date.now();
  const item: VaultItem = {
    ...input,
    id: makeId(),
    favorite: false,
    deleted: false,
    createdAt: now,
    lastModified: now
  };
  writeState(recordAudit({ ...state, items: [item, ...state.items] }, "created", item.name));
}

export function updateItem(id: string, patch: Partial<Omit<VaultItem, "id">>): void {
  const state = readState();
  const items = state.items.map((item) => (item.id === id ? touch({ ...item, ...patch, id: item.id }) : item));
  const target = state.items.find((item) => item.id === id);
  writeState(recordAudit({ ...state, items }, "updated", target?.name ?? "item"));
}

export function setFavorite(id: string, favorite: boolean): void {
  updateItem(id, { favorite });
}

export function moveToTrash(id: string): void {
  const state = readState();
  const items = state.items.map((item) => (item.id === id ? touch({ ...item, deleted: true, deletedAt: Date.now() }) : item));
  const target = state.items.find((item) => item.id === id);
  writeState(recordAudit({ ...state, items }, "trashed", target?.name ?? "item"));
}

export function restoreItem(id: string): void {
  const state = readState();
  const items = state.items.map((item) => {
    if (item.id !== id) return item;
    const { deletedAt, ...rest } = item;
    return touch({ ...rest, deleted: false });
  });
  const target = state.items.find((item) => item.id === id);
  writeState(recordAudit({ ...state, items }, "restored", target?.name ?? "item"));
}

export function deletePermanently(id: string): void {
  const state = readState();
  const target = state.items.find((item) => item.id === id);
  writeState(recordAudit({ ...state, items: state.items.filter((item) => item.id !== id) }, "deleted", target?.name ?? "item"));
}

export function resetVault(): void {
  cachedData = null;
  localStorage.removeItem(ITEMS_KEY);
  emit();
}

// ---- Vault setup / unlock ----

export type VaultAuth = {
  exists: boolean;
  unlocked: boolean;
  email: string;
};

export function readAuth(): VaultAuth {
  const data = readData();
  const exists = Boolean(data);
  const unlocked = localStorage.getItem(UNLOCK_KEY) === "true";
  return { exists, unlocked, email: data?.email ?? "" };
}

export function useVaultAuth(): VaultAuth {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    readAuth
  );
}

async function sha256(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createVault(email: string, masterPassword: string): Promise<void> {
  const salt = randomHex(16);
  const hash = await sha256(`${salt}:${masterPassword}`);
  const state: VaultState = { items: [], audit: [], createdAt: Date.now() };
  cachedData = { state, salt, hash, email };
  localStorage.setItem(ITEMS_KEY, JSON.stringify(cachedData));
  localStorage.setItem(UNLOCK_KEY, "true");
  emit();
}

export async function verifyMasterPassword(masterPassword: string): Promise<boolean> {
  const data = readData();
  if (!data) return false;
  const hash = await sha256(`${data.salt}:${masterPassword}`);
  return hash === data.hash;
}

export function unlockVault(): void {
  localStorage.setItem(UNLOCK_KEY, "true");
  emit();
}

export function lockVault(): void {
  localStorage.setItem(UNLOCK_KEY, "false");
  cachedData = null;
  cachedSettings = null;
  emit();
}

export function updateEmail(email: string): void {
  const data = readData();
  if (!data) return;
  cachedData = { ...data, email };
  localStorage.setItem(ITEMS_KEY, JSON.stringify(cachedData));
  emit();
}