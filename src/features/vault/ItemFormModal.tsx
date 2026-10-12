import { Eye, EyeOff, Wand2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../shared/ui/Modal";
import { useToast } from "../../shared/ui/Toast";
import { copyText } from "../../shared/clipboard";
import { generatePassword } from "../../lib/passwordGenerator";
import { CATEGORIES, ITEM_TYPES, addItem, updateItem } from "./vaultStore";
import type { Category, ItemType, VaultItem } from "./vaultStore";

type FormErrors = {
  name?: string;
  username?: string;
  password?: string;
  website?: string;
};

type Draft = {
  name: string;
  type: ItemType;
  username: string;
  password: string;
  website: string;
  notes: string;
  category?: Category;
};

function toDraft(item?: VaultItem): Draft {
  return {
    name: item?.name ?? "",
    type: item?.type ?? "Login",
    username: item?.username ?? "",
    password: item?.password ?? "",
    website: item?.website ?? "",
    notes: item?.notes ?? "",
    category: item?.category
  };
}

function validate(draft: Draft): FormErrors {
  const errors: FormErrors = {};
  if (!draft.name.trim()) errors.name = "Name is required";
  if (draft.type === "Login") {
    if (!draft.username.trim()) errors.username = "Username is required";
    if (!draft.password) errors.password = "Password is required";
  }
  if (draft.website.trim()) {
    try {
      const url = new URL(draft.website);
      if (!/^https?:$/.test(url.protocol)) errors.website = "Website must be a valid URL";
    } catch {
      errors.website = "Website must be a valid URL";
    }
  }
  return errors;
}

export function ItemFormModal({ item, onClose, onSaved }: { item?: VaultItem; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const [errors, setErrors] = useState<FormErrors>({});
  const [reveal, setReveal] = useState(false);
  const toast = useToast();

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (item) {
      updateItem(item.id, { ...draft, name: draft.name.trim(), website: draft.website.trim() });
      toast({ message: "Credential updated", tone: "success" });
    } else {
      addItem({ ...draft, name: draft.name.trim(), website: draft.website.trim() });
      toast({ message: "Item added to vault", tone: "success" });
    }
    onSaved();
  }

  function fillPassword() {
    const value = generatePassword({ length: 16, upper: true, lower: true, numbers: true, symbols: true, avoidAmbiguous: false });
    setField("password", value);
  }

  return (
    <Modal title={item ? "Edit Item" : "New Item"} onClose={onClose}>
      <label className="form-field">
        <span>Item type</span>
        <select value={draft.type} onChange={(e) => setField("type", e.target.value as ItemType)}>
          {ITEM_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label className="form-field">
        <span>Name</span>
        <input value={draft.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. GitHub" />
        {errors.name ? <span className="field-error">{errors.name}</span> : null}
      </label>
      {draft.type === "Login" ? (
        <>
          <label className="form-field">
            <span>Username</span>
            <input value={draft.username} onChange={(e) => setField("username", e.target.value)} placeholder="you@example.com" />
            {errors.username ? <span className="field-error">{errors.username}</span> : null}
          </label>
          <label className="form-field">
            <span>Password</span>
            <div className="input-group">
              <input type={reveal ? "text" : "password"} value={draft.password} onChange={(e) => setField("password", e.target.value)} placeholder="••••••••" />
              <button type="button" className="icon-button input-action" onClick={() => setReveal((value) => !value)} aria-label={reveal ? "Hide password" : "Show password"}>
                {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button type="button" className="icon-button input-action" onClick={fillPassword} aria-label="Generate password">
                <Wand2 size={16} />
              </button>
            </div>
            {errors.password ? <span className="field-error">{errors.password}</span> : null}
          </label>
        </>
      ) : null}
      <label className="form-field">
        <span>Website</span>
        <input value={draft.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://example.com" />
        {errors.website ? <span className="field-error">{errors.website}</span> : null}
      </label>
      <label className="form-field">
        <span>Category</span>
        <select value={draft.category ?? ""} onChange={(e) => setField("category", e.target.value ? (e.target.value as Category) : undefined)}>
          <option value="">None</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>
      <label className="form-field">
        <span>Notes</span>
        <textarea value={draft.notes} onChange={(e) => setField("notes", e.target.value)} rows={3} placeholder="Optional notes" />
      </label>
      <div className="modal-actions">
        <button className="icon-button" onClick={onClose}>Cancel</button>
        <button className="primary-button" onClick={handleSave}>Save Item</button>
      </div>
    </Modal>
  );
}