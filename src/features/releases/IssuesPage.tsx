import { Siren } from "lucide-react";
import { issues } from "./data";
import type { Issue } from "./data";
import { EnvironmentBadge } from "./ui";

export function IssuesPage({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>Issues</h2>
          <p>Surfaced application issues, read-only.</p>
        </div>
      </div>
      <div className="issues-page-list">
        {issues.map((issue: Issue) => (
          <button key={issue.id} className="issue-row" onClick={() => onOpen(issue.id)}>
            <span className={`issue-icon ${issue.severity}`}><Siren size={15} /></span>
            <span className="issue-body">
              <span className="issue-title">{issue.title}</span>
              <span className="issue-meta"><EnvironmentBadge environment={issue.environment} /> · {issue.time}</span>
            </span>
            <span className={`issue-severity ${issue.severity}`}>{issue.severity}</span>
          </button>
        ))}
      </div>
    </section>
  );
}