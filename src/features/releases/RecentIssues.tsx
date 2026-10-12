import { Siren } from "lucide-react";
import type { Issue } from "./data";
import { Card } from "./ui";

function severityIcon(severity: Issue["severity"]) {
  return <span className={`issue-icon ${severity}`}><Siren size={15} /></span>;
}

export function RecentIssues({ issues, onOpen }: { issues: Issue[]; onOpen: (issue: Issue) => void }) {
  return (
    <Card title="Recent Issues">
      <div className="issue-list">
        {issues.map((issue) => (
          <button key={issue.id} className="issue-row" onClick={() => onOpen(issue)}>
            {severityIcon(issue.severity)}
            <span className="issue-body">
              <span className="issue-title">{issue.title}</span>
              <span className="issue-meta">{issue.environment} · {issue.time}</span>
            </span>
            <span className={`issue-severity ${issue.severity}`}>{issue.severity}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

export function RecentIssuesSkeleton() {
  return (
    <Card title="Recent Issues">
      <div className="issue-list">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="issue-row">
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 6 }} />
            <div className="issue-body">
              <div className="skeleton skeleton-line" style={{ width: 180 }} />
              <div className="skeleton skeleton-line" style={{ width: 120 }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}