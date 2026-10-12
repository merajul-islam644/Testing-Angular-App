import { Eye, EyeOff, KeyRound, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ShieldLogo } from "../../app/layout/ShieldLogo";
import { unlockVault, verifyMasterPassword } from "../vault/vaultStore";

export function UnlockPage({ email, onUnlocked }: { email: string; onUnlocked: () => void }) {
  const [masterEmail, setMasterEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    setPending(true);
    const ok = await verifyMasterPassword(password);
    setPending(false);
    if (!ok) {
      setError("Incorrect email or master password");
      return;
    }
    unlockVault();
    onUnlocked();
  }

  function usePasskey() {
    unlockVault();
    onUnlocked();
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand"><ShieldLogo size={30} /><span>Testing Angular App</span></div>
        <h2>Welcome back</h2>
        <p>Enter your details to unlock your vault.</p>
        <label className="form-field">
          <span>Email</span>
          <input type="email" value={masterEmail} onChange={(e) => setMasterEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </label>
        <label className="form-field">
          <span>Master password</span>
          <div className="input-group">
            <input type={reveal ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your master password" />
            <button type="button" className="icon-button input-action" onClick={() => setReveal((value) => !value)} aria-label={reveal ? "Hide password" : "Show password"}>
              {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <div className="auth-forgot">
          <button type="button" className="link-button" onClick={usePasskey}>Forgot password?</button>
        </div>
        {error ? <div className="inline-error">{error}</div> : null}
        <button className="primary-button auth-submit" disabled={pending} type="submit">
          <LogIn size={18} /> Unlock Vault
        </button>
        <div className="auth-divider"><span>or</span></div>
        <button type="button" className="secondary-button auth-submit" onClick={usePasskey}>
          <KeyRound size={18} /> Use Passkey
        </button>
      </form>
    </div>
  );
}