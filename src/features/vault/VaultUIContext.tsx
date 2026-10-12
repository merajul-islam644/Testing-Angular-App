import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type VaultUIValue = {
  selectedId: string | null;
  selectItem: (id: string | null) => void;
  editItemId: string | null;
  openNewItem: () => void;
  openEditItem: (id: string) => void;
  closeItemEditor: () => void;
  search: string;
  setSearch: (term: string) => void;
};

const VaultUIContext = createContext<VaultUIValue | undefined>(undefined);

export function VaultUIProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const value = useMemo<VaultUIValue>(() => ({
    selectedId,
    selectItem: setSelectedId,
    editItemId,
    openNewItem: () => setEditItemId(""),
    openEditItem: (id) => setEditItemId(id),
    closeItemEditor: () => setEditItemId(null),
    search,
    setSearch
  }), [selectedId, editItemId, search]);

  return <VaultUIContext.Provider value={value}>{children}</VaultUIContext.Provider>;
}

export function useVaultUI() {
  const context = useContext(VaultUIContext);
  if (!context) throw new Error("useVaultUI must be used within VaultUIProvider");
  return context;
}