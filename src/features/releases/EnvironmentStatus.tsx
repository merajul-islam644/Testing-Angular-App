import { ChevronRight } from "lucide-react";
import { environments } from "./data";
import type { EnvironmentStatus } from "./data";
import { Card } from "./ui";

export function EnvironmentStatusList({ onSelect }: { onSelect: (env: EnvironmentStatus) => void }) {
  return (
    <Card title="Environment Status">
      <div className="env-status-list">
        {environments.map((env) => (
          <button key={env.name} className="env-status-row" onClick={() => onSelect(env)}>
            <span className="env-status-dot" style={{ background: env.color }} />
            <span className="env-status-name">{env.name}</span>
            <span className="env-status-word">{env.status}</span>
            <span className="env-status-score">{env.healthScore}%</span>
            <ChevronRight size={15} className="env-status-chevron" />
          </button>
        ))}
      </div>
    </Card>
  );
}

export function EnvironmentStatusSkeleton() {
  return (
    <Card title="Environment Status">
      <div className="env-status-list">
        {environments.map((env) => (
          <div key={env.name} className="env-status-row">
            <div className="skeleton" style={{ width: 8, height: 8, borderRadius: 999 }} />
            <div className="skeleton skeleton-line" style={{ width: 90 }} />
            <div className="skeleton skeleton-line" style={{ width: 60 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}