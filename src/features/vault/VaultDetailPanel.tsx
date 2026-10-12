import { Copy, ExternalLink, Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { copyText } from "../../shared/clipboard";
import { useToast } from "../../shared/ui/Toast";
import { useVault, moveToTrash, setFavorite } from "./vaultStore";
import { itemIcon } from "./itemIcons";
import { useVaultUI } from "./VaultUIContext";
import { timeAgo } from "../../lib/format";
import { ShieldLogo } from "../../app/layout/ShieldLogo";

export function VaultDetailPanel() {
  const { selectedId, openEditItem } = useVaultUI();
  const vault = useVault();
  const toast = useToast();
  const item = vault.items.find((entry) => entry.id === selectedId && !entry.deleted);
  const [revealed, setRevealed] = useState(false);

  if (!item) {
    return (
      <div className="detail-empty">
        <div className="brand-mark"><ShieldLogo size={40} /></div>
        <p>Select an item to see its details</p>
      </div>
    );
  }

  const Icon = itemIcon(item.type);

  async function copyValue(value: string, label: string) {
    await copyText(value);
    toast({ message: `${label} copied to clipboard`, tone: "success" });
  }

  return (
    <div className="detail-body">
      <div className="detail-head">
        <div className="detail-icon"><Icon size={22} /></div>
        <div className="detail-title">
          <strong>{item.name}</strong>
          <span>{item.category ?? item.type}</span>
        </div>
        <button className="icon-button" onClick={() => setFavorite(item.id, !item.favorite)} aria-label="Toggle favorite">
          <Star size={18} fill={item.favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <dl className="detail-fields">
        {item.category ? (
          <div className="detail-field">
            <dt>Category</dt>
            <dd><span className="chip">{item.category}</span></dd>
          </div>
        ) : null}

        {item.username ? (
          <div className="detail-field">
            <dt>Username</dt>
            <dd className="detail-value">
              <span>{item.username}</span>
              <button className="icon-button" onClick={() => copyValue(item.username, "Username")} aria-label="Copy username">
                <Copy size={15} />
              </button>
            </dd>
          </div>
        ) : null}

        {item.password ? (
          <div className="detail-field">
            <dt>Password</dt>
            <dd className="detail-value">
              <span className="mono">{revealed ? item.password : "•".repeat(12)}</span>
              <button className="icon-button" onClick={() => setRevealed((value) => !value)} aria-label={revealed ? "Hide password" : "Reveal password"}>
                {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button className="icon-button" onClick={() => copyValue(item.password, "Password")} aria-label="Copy password">
                <Copy size={15} />
              </button>
            </dd>
          </div>
        ) : null}

        {item.website ? (
          <div className="detail-field">
            <dt>Website</dt>
            <dd className="detail-value">
              <a href={item.website} target="_blank" rel="noreferrer" className="link-button">{safeHostname(item.website)}</a>
              <ExternalLink size={14} />
            </dd>
          </div>
        ) : null}

        {item.notes ? (
          <div className="detail-field">
            <dt>Notes</dt>
            <dd className="detail-notes">{item.notes}</dd>
          </div>
        ) : null}

        <div className="detail-field">
          <dt>Last Modified</dt>
          <dd className="muted">{timeAgo(item.lastModified)}</dd>
        </div>
      </dl>

      <div className="detail-actions">
        <button className="primary-button" onClick={() => openEditItem(item.id)}><Pencil size={16} /> Edit</button>
        <button className="secondary-button" onClick={() => { moveToTrash(item.id); toast({ message: "Item moved to trash", tone: "info" }); }}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

function safeHostname(website: string): string {
  try {
    return new URL(website).hostname;
  } catch {
    return website;
  }
}