import { Check } from "lucide-react";
import type { Deployment } from "./data";
import { EnvironmentBadge } from "./ui";
import { Card, CardAction } from "./ui";

export function LatestDeployment({ deployment, onViewAll, onOpen }: { deployment: Deployment; onViewAll: () => void; onOpen: () => void }) {
  return (
    <Card
      title="Latest Deployment"
      action={<CardAction onClick={onViewAll}>View all →</CardAction>}
    >
      <button className="latest-deploy" onClick={onOpen}>
        <div className="latest-deploy-head">
          <span className="latest-deploy-version">{deployment.version}</span>
          <EnvironmentBadge environment={deployment.environment} />
          <span className="mono latest-deploy-commit">{deployment.commit}</span>
        </div>
        <div className="latest-deploy-meta">
          <span>{deployment.branch}</span>
          <span className="dot" />
          <span>{deployment.deployedAt}</span>
        </div>
        <div className="latest-deploy-steps">
          {deployment.pipeline.map((stage) => (
            <div key={stage.name} className="latest-deploy-step">
              <Check size={14} className="latest-deploy-check" />
              <span>{stage.name}</span>
              <span className="latest-deploy-duration">{stage.duration}</span>
            </div>
          ))}
        </div>
      </button>
    </Card>
  );
}

export function LatestDeploymentSkeleton() {
  return (
    <Card title="Latest Deployment">
      <div className="latest-deploy">
        <div className="skeleton skeleton-line-lg" />
        <div className="skeleton skeleton-line" style={{ width: 140 }} />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="latest-deploy-step">
            <div className="skeleton" style={{ width: 14, height: 14, borderRadius: 999 }} />
            <div className="skeleton skeleton-line" style={{ width: 120 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}