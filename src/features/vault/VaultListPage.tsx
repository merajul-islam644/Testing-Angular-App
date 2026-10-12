import { Copy, ExternalLink, MoreVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { copyText } from "../../shared/clipboard";
import { useToast } from "../../shared/ui/Toast";
import { CATEGORIES, moveToTrash, restoreItem, setFavorite, useVault } from "./vaultStore";
import type { Category, VaultItem } from "./vaultStore";
import { itemIcon } from "./itemIcons";
import { useVaultUI } from "./VaultUIContext";
import { timeAgo } from "../../lib/format";
import { Skeleton } from "../../shared/ui/Skeleton";
import { ItemFormModal } from "./ItemFormModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../shared/ui/dropdown-menu";
import { ShieldLogo } from "../../app/layout/ShieldLogo";
import { TrashView } from "./TrashView";

export type VaultView = "all" | "favorites" | "recent";

export function VaultListPage({ view }: { view: VaultView }) {
  const vault = useVault();
  const { selectItem, editItemId, openNewItem, closeItemEditor, search, setSearch } = useVaultUI();
  const toast = useToast();
  const [category, setCategory] = useState<Category | "">("");
  const [sort, setSort] = useState<"name" | "modified">("name");
  const [grid, setGrid] = useState(false);

  const visible = useMemo(() => {
    let items = vault.items.filter((item) => !item.deleted);
    if (view === "favorites") items = items.filter((item) => item.favorite);
    if (view === "recent") items = [...items].sort((a, b) => b.lastModified - a.lastModified).slice(0, 10);
    if (category) items = items.filter((item) => item.category === category);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter((item) =>
        [item.name, item.username, item.website, item.category ?? "", item.notes].some((field) => field.toLowerCase().includes(term))
      );
    }
    if (view !== "recent") {
      items = [...items].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.lastModified - a.lastModified));
    }
    return items;
  }, [vault.items, view, category, search, sort]);

  const titles: Record<VaultView, string> = {
    all: "All Items",
    favorites: "Favorites",
    recent: "Recent"
  };

  if (editItemId !== null) {
    const editing = editItemId === "" ? undefined : vault.items.find((item) => item.id === editItemId);
    return <ItemFormModal item={editing} onClose={closeItemEditor} onSaved={closeItemEditor} />;
  }

  return (
    <section className="vault-page">
      <div className="page-header">
        <div>
          <h2>{titles[view]}</h2>
          <p className="page-count">{visible.length} {visible.length === 1 ? "item" : "items"}</p>
        </div>
        <div className="page-actions">
          {view === "all" ? <button className="primary-button" onClick={openNewItem}><Plus size={18} /> New Item</button> : null}
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-actions">
          <input className="search-input" type="search" placeholder="Search in your vault…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="toolbar-actions">
          <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
            <option value="">All Categories</option>
            {CATEGORIES.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
          </select>
          <select className="select-input" value={sort} onChange={(e) => setSort(e.target.value as "name" | "modified")}>
            <option value="name">Name (A–Z)</option>
            <option value="modified">Last Modified</option>
          </select>
          <div className="view-toggle">
            <button className={!grid ? "active" : ""} onClick={() => setGrid(false)} aria-label="List view">☰</button>
            <button className={grid ? "active" : ""} onClick={() => setGrid(true)} aria-label="Grid view">▦</button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        search.trim() || category ? (
          <div className="empty-state vault-empty">
            <div className="empty-icon"><ShieldLogo size={40} /></div>
            <h3>No results found — try a different search term</h3>
          </div>
        ) : (
          <VaultEmpty view={view} onAdd={openNewItem} />
        )
      ) : grid ? (
        <ItemGrid items={visible} />
      ) : (
        <ItemTable items={visible} onSelect={selectItem} view={view} />
      )}
    </section>
  );
}

function VaultEmpty({ view, onAdd }: { view: VaultView; onAdd: () => void }) {
  return (
    <div className="empty-state vault-empty">
      <div className="empty-icon"><ShieldLogo size={40} /></div>
      <h3>Your vault is empty</h3>
      <p>Add your first credential to start protecting your accounts.</p>
      {view === "all" ? <button className="primary-button" onClick={onAdd}><Plus size={16} /> Add Item</button> : null}
    </div>
  );
}

function ItemTable({ items, onSelect, view }: { items: VaultItem[]; onSelect: (id: string) => void; view: VaultView }) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Username</th>
            <th>Last Modified</th>
            <th>Favorite</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => <ItemRow key={item.id} item={item} onSelect={onSelect} view={view} />)}
        </tbody>
      </table>
    </div>
  );
}

function ItemRow({ item, onSelect, view }: { item: VaultItem; onSelect: (id: string) => void; view: VaultView }) {
  const toast = useToast();
  const { openEditItem } = useVaultUI();
  const Icon = itemIcon(item.type);

  async function copyValue(value: string, label: string) {
    await copyText(value);
    toast({ message: `${label} copied to clipboard`, tone: "success" });
  }

  return (
    <tr onClick={() => onSelect(item.id)} style={{ cursor: "pointer" }}>
      <td>
        <span className="row-name"><Icon size={18} /><span>{item.name}</span></span>
      </td>
      <td>{item.category ? <span className="chip">{item.category}</span> : <span className="muted">—</span>}</td>
      <td className="muted">{item.username || "—"}</td>
      <td className="muted">{timeAgo(item.lastModified)}</td>
      <td>
        <button
          className="icon-button"
          aria-label="Toggle favorite"
          onClick={(e) => { e.stopPropagation(); setFavorite(item.id, !item.favorite); }}
        >
          <Star size={16} fill={item.favorite ? "currentColor" : "none"} />
        </button>
      </td>
      <td>
        <div className="row-actions" onClick={(e) => e.stopPropagation()}>
          {view === "all" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="icon-button" aria-label="Item actions"><MoreVertical size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onSelect(item.id)}>View</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openEditItem(item.id)}><Pencil size={16} /> Edit</DropdownMenuItem>
                {item.username ? <DropdownMenuItem onSelect={() => copyValue(item.username, "Username")}><Copy size={16} /> Copy Username</DropdownMenuItem> : null}
                {item.password ? <DropdownMenuItem onSelect={() => copyValue(item.password, "Password")}><Copy size={16} /> Copy Password</DropdownMenuItem> : null}
                {item.website ? (
                  <DropdownMenuItem onSelect={() => window.open(item.website, "_blank", "noreferrer")}><ExternalLink size={16} /> Open Website</DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onSelect={() => setFavorite(item.id, !item.favorite)}><Star size={16} /> {item.favorite ? "Remove from Favorites" : "Add to Favorites"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={() => { moveToTrash(item.id); toast({ message: "Item moved to trash", tone: "info" }); }}><Trash2 size={16} /> Move to Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="icon-button" aria-label="Move to trash" onClick={() => { moveToTrash(item.id); toast({ message: "Item moved to trash", tone: "info" }); }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function ItemGrid({ items }: { items: VaultItem[] }) {
  const { selectItem } = useVaultUI();
  return (
    <div className="item-grid">
      {items.map((item) => {
        const Icon = itemIcon(item.type);
        return (
          <button key={item.id} className="item-card" onClick={() => selectItem(item.id)}>
            <div className="item-card-icon"><Icon size={20} /></div>
            <strong>{item.name}</strong>
            <span className="muted">{item.category ?? item.type}</span>
          </button>
        );
      })}
    </div>
  );
}

export function VaultSkeleton() {
  return (
    <div className="vault-skeleton" aria-label="Loading your vault">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <Skeleton className="skeleton-icon" />
          <div className="skeleton-cols">
            <Skeleton className="skeleton-line" style={{ width: "45%" }} />
            <Skeleton className="skeleton-line" style={{ width: "30%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}