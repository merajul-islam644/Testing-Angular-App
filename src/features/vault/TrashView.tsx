import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../shared/ui/Toast";
import { ConfirmDialog } from "../../shared/ui/ConfirmDialog";
import { deletePermanently, restoreItem, useVault } from "./vaultStore";
import type { VaultItem } from "./vaultStore";
import { itemIcon } from "./itemIcons";
import { timeAgo } from "../../lib/format";
import { ShieldLogo } from "../../app/layout/ShieldLogo";

export function TrashView() {
  const vault = useVault();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState<VaultItem | null>(null);
  const items = vault.items.filter((item) => item.deleted);

  return (
    <section className="vault-page">
      <div className="page-header">
        <div>
          <h2>Trash</h2>
          <p className="page-count">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state vault-empty">
          <div className="empty-icon"><ShieldLogo size={40} /></div>
          <h3>Trash is empty</h3>
          <p>Deleted items appear here and can be restored.</p>
        </div>
      ) : (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Deleted</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const Icon = itemIcon(item.type);
                return (
                  <tr key={item.id}>
                    <td><span className="row-name"><Icon size={18} /><span>{item.name}</span></span></td>
                    <td>{item.category ? <span className="chip">{item.category}</span> : <span className="muted">—</span>}</td>
                    <td className="muted">{item.deletedAt ? `Deleted ${timeAgo(item.deletedAt)}` : "—"}</td>
                    <td>
                      <div className="row-actions">
                        <button className="secondary-button" onClick={() => { restoreItem(item.id); toast({ message: "Item restored", tone: "success" }); }}>
                          <RotateCcw size={15} /> Restore
                        </button>
                        <button className="secondary-button danger-soft" onClick={() => setPendingDelete(item)}>
                          <Trash2 size={15} /> Delete Permanently
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete Permanently"
          message={`This permanently deletes "${pendingDelete.name}" and cannot be undone.`}
          confirmLabel="Delete Permanently"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => { deletePermanently(pendingDelete.id); setPendingDelete(null); toast({ message: "Item permanently deleted", tone: "info" }); }}
        />
      ) : null}
    </section>
  );
}