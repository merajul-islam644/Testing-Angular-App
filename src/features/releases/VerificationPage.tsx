import { useState } from "react";
import { Check, CircleX } from "lucide-react";
import { deployments } from "./data";
import type { Deployment, VerificationCheck } from "./data";
import { Card, EnvironmentBadge, Mono } from "./ui";

const verificationChecks: VerificationCheck[] = [
  { name: "Application Load", passed: true, value: "1.2s" },
  { name: "Console Errors", passed: true, value: "0" },
  { name: "Network Requests", passed: true, value: "42/42" },
  { name: "Navigation", passed: true, value: "8/8" },
  { name: "Broken Links", passed: true, value: "0" },
  { name: "Primary Heading", passed: false, value: "missing", evidence: { label: "Screenshots", detail: "The page renders without the primary H1 heading on the latest build — see attached screenshot." } },
  { name: "Responsive Layout", passed: false, value: "overflow", evidence: { label: "Screenshots", detail: "On 768px viewport the metrics grid overflows horizontally — see attached screenshot." } }
];

function CheckRow({ check, onSelect }: { check: VerificationCheck; onSelect: (check: VerificationCheck) => void }) {
  return (
    <button className="verification-row clickable" onClick={() => onSelect(check)}>
      {check.passed ? <Check size={16} className="verify-pass" /> : <CircleX size={16} className="verify-fail" />}
      <span className="verify-name">{check.name}</span>
      <span className="verify-value">{check.value}</span>
      <span className={`verify-state ${check.passed ? "pass" : "fail"}`}>{check.passed ? "Pass" : "Fail"}</span>
    </button>
  );
}

export function VerificationPage({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<VerificationCheck | null>(null);
  const failed = verificationChecks.filter((check) => !check.passed);
  const deployment: Deployment = deployments[0]!;

  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>Verification</h2>
          <p>Verification checks for {deployment.version} · <EnvironmentBadge environment={deployment.environment} /> · <Mono>{deployment.commit}</Mono></p>
        </div>
      </div>

      <div className="detail-grid">
        <Card title="Verification Results">
          <div className="verification-list">
            {verificationChecks.map((check) => <CheckRow key={check.name} check={check} onSelect={setSelected} />)}
          </div>
        </Card>

        {selected ? (
          <Card title={`Evidence — ${selected.name}`}>
            {selected.passed ? (
              <p className="muted">This check passed and has no evidence attached.</p>
            ) : selected.evidence ? (
              <div className="evidence-block">
                <span className={`issue-severity high`}>{selected.evidence.label}</span>
                <p>{selected.evidence.detail}</p>
              </div>
            ) : (
              <p className="muted">No evidence recorded for this check.</p>
            )}
          </Card>
        ) : (
          <Card title="Failed Checks">
            {failed.length === 0 ? (
              <p className="muted">All checks passed.</p>
            ) : (
              <div className="verification-list">
                {failed.map((check) => <CheckRow key={check.name} check={check} onSelect={setSelected} />)}
              </div>
            )}
          </Card>
        )}
      </div>
    </section>
  );
}