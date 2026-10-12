import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { useVault } from "../vault/vaultStore";
import { useVaultUI } from "../vault/VaultUIContext";
import { MOCKED_BREACHES } from "./securityAnalysis";

export function BreachPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const vault = useVault();
  const { selectItem } = useVaultUI();

  const critical = MOCKED_BREACHES.filter((entry) => entry.severity === "Critical").length;
  const warnings = MOCKED_BREACHES.filter((entry) => entry.severity === "Warning").length;
  const safe = 0;

  function review(account: string) {
    const username = account.split("@")[0] ?? account;
    const match = vault.items.find((item) => !item.deleted && item.username.toLowerCase().startsWith(username.toLowerCase()));
    selectItem(match?.id ?? null);
    onNavigate("/");
  }

  return (
    <section className="breach-page">
      <div className="page-header">
        <div>
          <h2>Breach Monitor</h2>
          <p className="page-count">See whether your accounts appear in known breaches.</p>
        </div>
      </div>

      <div className="alert alert-info breach-note">
        <ShieldAlert size={16} /> Breach data shown here is illustrative and not based on real monitoring.
      </div>

      <div className="metrics">
        <div className="metric"><span className="stat-tone stat-danger">Critical</span><strong>{critical}</strong></div>
        <div className="metric"><span className="stat-tone stat-warn">Warnings</span><strong>{warnings}</strong></div>
        <div className="metric"><span className="stat-tone stat-good">Safe</span><strong>{safe}</strong></div>
      </div>

      <div className="panel">
        <div className="panel-title"><AlertTriangle size={16} /><span>Your accounts</span></div>
        {MOCKED_BREACHES.map((entry) => (
          <div className="breach-row" key={entry.account}>
            <span className={`severity-dot severity-${entry.severity.toLowerCase()}`} />
            <div className="breach-account">
              <strong>{entry.account}</strong>
              <span className="muted">{entry.detail}</span>
            </div>
            {entry.severity === "Warning" ? <CheckCircle2 className="muted" size={16} /> : <AlertTriangle size={16} className="stat-danger" />}
            <button className="secondary-button" onClick={() => review(entry.account)}>Review Credential</button>
          </div>
        ))}
      </div>
    </section>
  );
}