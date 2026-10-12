import { Lock, Palette, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { useTheme } from "../../app/theme/ThemeProvider";
import { useSettings, settingsStore } from "../vault/vaultStore";
import { CATEGORIES } from "../vault/vaultStore";
import type { Category } from "../vault/vaultStore";

function UnavailableBadge() {
  return <span className="pill pill-neutral">Unavailable in this version</span>;
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const settings = useSettings();

  return (
    <section className="settings-page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="page-count">Manage how Testing Angular App looks and behaves.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><Palette size={16} /><span>General</span></div>
        <div className="setting-row">
          <div>
            <strong>Theme</strong>
            <p className="muted">Applies instantly across Testing Angular App.</p>
          </div>
          <div className="segmented">
            {(["light", "dark", "system"] as const).map((value) => (
              <button key={value} className={theme === value ? "active" : ""} onClick={() => setTheme(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <div>
            <strong>Language</strong>
            <p className="muted">Testing Angular App is available in English.</p>
          </div>
          <select className="select-input" value={settings.language} onChange={(e) => settingsStore.save({ language: e.target.value as "en" })}>
            <option value="en">English</option>
          </select>
        </div>
        <div className="setting-row">
          <div>
            <strong>Default category</strong>
            <p className="muted">Pre-selected when adding a new item.</p>
          </div>
          <select className="select-input" value={settings.defaultCategory ?? ""} onChange={(e) => settingsStore.save({ defaultCategory: e.target.value ? (e.target.value as Category) : undefined })}>
            <option value="">None</option>
            {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="setting-row">
          <div>
            <strong>Session timeout</strong>
            <p className="muted">Stored but not enforced in this version.</p>
          </div>
          <div className="setting-unavailable"><select className="select-input" disabled><option>30 minutes</option></select><UnavailableBadge /></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><Lock size={16} /><span>Security</span></div>
        <div className="setting-row">
          <div>
            <strong>Change master password</strong>
            <p className="muted">Rotate your vault's master password.</p>
          </div>
          <UnavailableBadge />
        </div>
        <div className="setting-row">
          <div>
            <strong>Auto-lock &amp; lock timeout</strong>
            <p className="muted">Automatically lock the vault after inactivity.</p>
          </div>
          <UnavailableBadge />
        </div>
        <div className="setting-row">
          <div>
            <strong>Re-authentication</strong>
            <p className="muted">Require your master password for sensitive actions.</p>
          </div>
          <UnavailableBadge />
        </div>
        <div className="setting-row">
          <div>
            <strong>Two-factor authentication</strong>
            <p className="muted">Add an extra layer of security.</p>
          </div>
          <UnavailableBadge />
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><SlidersHorizontal size={16} /><span>Vault</span></div>
        <div className="setting-row">
          <div>
            <strong>Import, export &amp; backup</strong>
            <p className="muted">Move or back up your vault items.</p>
          </div>
          <UnavailableBadge />
        </div>
      </div>
    </section>
  );
}