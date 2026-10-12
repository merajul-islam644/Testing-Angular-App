import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ShieldLogo } from "../../app/layout/ShieldLogo";
import { StrengthMeter } from "../../shared/ui/StrengthMeter";
import { createVault } from "../vault/vaultStore";

export function SetupPage({ onCreated }: { onCreated: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!password || password !== confirm) {
      setError("Master password and confirmation must match");
      return;
    }
    if (!acknowledged) {
      setError("You must confirm the master password cannot be recovered");
      return;
    }
    setError(undefined);
    setPending(true);
    await createVault("", password);
    onCreated();
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand"><ShieldLogo size={30} /><span>Testing Angular App</span></div>
        <h2>Create Your Secure Vault</h2>
        <p>Set a master password to protect your items. It unlocks the vault on this device.</p>
        <label className="form-field">
          <span>Master password</span>
          <div className="input-group">
            <input type={reveal ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a master password" />
            <button type="button" className="icon-button input-action" onClick={() => setReveal((value) => !value)} aria-label={reveal ? "Hide password" : "Show password"}>
              {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <StrengthMeter password={password} label={password.length > 0} />
        <label className="form-field">
          <span>Confirm master password</span>
          <input type={reveal ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm your master password" />
        </label>
        <label className="ack-row">
          <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
          <span>I understand that the master password cannot be recovered</span>
        </label>
        {error ? <div className="inline-error">{error}</div> : null}
        <button className="primary-button auth-submit" disabled={pending} type="submit">
          <ShieldCheck size={18} /> Create Secure Vault
        </button>
      </form>
    </div>
  );
}