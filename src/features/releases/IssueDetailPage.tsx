import { Siren } from "lucide-react";
import { issues } from "./data";
import type { Issue } from "./data";
import { Card, EnvironmentBadge } from "./ui";

export function IssueDetailPage({ issueId, onBack }: { issueId: string; onBack: () => void }) {
  const issue: Issue = issues.find((item) => item.id === issueId) ?? issues[0]!;

  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>{issue.title}</h2>
          <p>
            <EnvironmentBadge environment={issue.environment} /> · {issue.time}
          </p>
        </div>
        <span className={`issue-severity ${issue.severity}`}>{issue.severity}</span>
      </div>

      <Card title="Issue Details">
        <div className="issue-detail-meta">
          <div className="issue-detail-item">
            <span className="issue-detail-label">Kind</span>
            <span className="issue-detail-value">{issue.kind}</span>
          </div>
          <div className="issue-detail-item">
            <span className="issue-detail-label">Environment</span>
            <span className="issue-detail-value">{issue.environment}</span>
          </div>
          <div className="issue-detail-item">
            <span className="issue-detail-label">Reported</span>
            <span className="issue-detail-value">{issue.time}</span>
          </div>
        </div>
        <div className="issue-severity-icon"><Siren size={18} /></div>
        <p className="issue-detail-text">{issue.detail}</p>
      </Card>
    </section>
  );
}