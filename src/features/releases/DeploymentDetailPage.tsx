import { Check, CircleX, Loader2, Minus } from "lucide-react";
import type { Deployment, StageStatus, VerificationCheck } from "./data";
import { getDeployment } from "./data";
import { Card, EnvironmentBadge, Mono } from "./ui";

function StageIcon({ status }: { status: StageStatus }) {
  if (status === "passed") return <Check size={16} />;
  if (status === "failed") return <CircleX size={16} />;
  if (status === "running") return <Loader2 size={16} className="spin" />;
  return <Minus size={16} />;
}

function stageClass(status: StageStatus): string {
  if (status === "passed") return "passed";
  if (status === "failed") return "failed";
  if (status === "running") return "running";
  return "pending";
}

function VerificationRow({ check }: { check: VerificationCheck }) {
  return (
    <div className="verification-row">
      {check.passed ? <Check size={16} className="verify-pass" /> : <CircleX size={16} className="verify-fail" />}
      <span className="verify-name">{check.name}</span>
      <span className="verify-value">{check.value}</span>
      {!check.passed && check.evidence ? <span className="verify-evidence">{check.evidence.label}</span> : null}
    </div>
  );
}

export function DeploymentDetailPage({
  deploymentId,
  onBack,
  onViewVerification
}: {
  deploymentId: string;
  onBack: () => void;
  onViewVerification: () => void;
}) {
  const deployment = getDeployment(deploymentId) ?? getDeployment("dep-01")!;

  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>Deployment {deployment.version}</h2>
          <p>
            <EnvironmentBadge environment={deployment.environment} /> · {deployment.branch} · <Mono>{deployment.commit}</Mono> · {deployment.deployedAt}
          </p>
        </div>
        <span className={`deploy-status ${deployment.status}`}>{deployment.status}</span>
      </div>

      <div className="detail-grid">
        <Card title="Timeline">
          <div className="timeline">
            {deployment.pipeline.map((stage, index) => (
              <div key={stage.name} className="timeline-stage">
                <div className="timeline-rail">
                  <span className={`timeline-icon ${stageClass(stage.status)}`}><StageIcon status={stage.status} /></span>
                  {index < deployment.pipeline.length - 1 ? <div className="timeline-line" /> : null}
                </div>
                <div className="timeline-body">
                  <div className="timeline-name">{stage.name}</div>
                  <div className="timeline-duration">{stage.duration || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Verification Results"
          action={<button className="card-action" onClick={onViewVerification}>View all →</button>}
        >
          <div className="verification-list">
            {deployment.verification.map((check) => <VerificationRow key={check.name} check={check} />)}
          </div>
        </Card>
      </div>

      <Card title="Evidence">
        <div className="evidence-grid">
          {["Screenshots", "Logs", "Network", "Console"].map((label) => (
            <div key={label} className="evidence-item">
              <span className="evidence-icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}