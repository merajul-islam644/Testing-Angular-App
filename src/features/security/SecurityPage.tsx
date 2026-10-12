import { AlertTriangle, ArrowRight, KeyRound, Lock, RefreshCw, Timer } from "lucide-react";
import { useVault } from "../vault/vaultStore";
import { useVaultUI } from "../vault/VaultUIContext";
import { analyzeSecurity } from "./securityAnalysis";

export function SecurityPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const vault = useVault();
  const { selectItem } = useVaultUI();
  const analysis = analyzeSecurity(vault.items);

  const stats = [
    { label: "Weak", value: analysis.weak, tone: "danger", icon: Lock },
    { label: "Reused", value: analysis.reused, tone: "warn", icon: RefreshCw },
    { label: "Old", value: analysis.old, tone: "warn", icon: Timer },
    { label: "Compromised", value: analysis.compromised, tone: "danger", icon: AlertTriangle }
  ];

  function fix(itemIds: string[]) {
    selectItem(itemIds[0] ?? null);
    onNavigate("/");
  }

  return (
    <section className="security-page">
      <div className="page-header">
        <div>
          <h2>Security Checkup</h2>
          <p className="page-count">Your vault's overall password health.</p>
        </div>
      </div>

      <div className="score-row">
        <div className="score-circle" style={{ "--score": `${analysis.score * 3.6}deg` } as React.CSSProperties}>
          <div className="score-inner">
            <strong>{analysis.score}</strong>
            <span>/ 100</span>
          </div>
        </div>
        <div className="score-label">
          <h3>{analysis.label}</h3>
          <p className="muted">Based on your vault items.</p>
        </div>
      </div>

      <div className="metrics">
        {stats.map((stat) => (
          <div className="metric" key={stat.label}>
            <span className={`stat-tone stat-${stat.tone}`}><stat.icon size={15} /> {stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title"><KeyRound size={16} /><span>Findings</span></div>
        {analysis.findings.length === 0 ? (
          <p className="muted">No findings — your vault looks healthy.</p>
        ) : (
          <ul className="finding-list">
            {analysis.findings.map((finding) => (
              <li key={finding.id} className="finding-item">
                <span className={`finding-badge finding-${finding.kind.toLowerCase()}`}>{finding.kind}</span>
                <span className="finding-label">{finding.label}</span>
                <button className="secondary-button" onClick={() => fix(finding.itemIds)}>
                  {finding.kind === "Compromised" ? "Fix Now" : "Change Password"} <ArrowRight size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}