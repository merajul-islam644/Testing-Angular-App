import { Check, Plus, Rocket } from "lucide-react";
import { useState } from "react";
import { AiInsight } from "./AiInsight";
import { EnvironmentStatusList, EnvironmentStatusSkeleton } from "./EnvironmentStatus";
import { HealthTrendChart, HealthTrendSkeleton } from "./HealthTrendChart";
import { KpiRow, KpiRowSkeleton } from "./KpiCards";
import { LatestDeployment, LatestDeploymentSkeleton } from "./LatestDeployment";
import { Pipeline } from "./Pipeline";
import { RangeSelector } from "./RangeSelector";
import type { RangeValue } from "./RangeSelector";
import { RecentDeployments, RecentDeploymentsSkeleton } from "./RecentDeployments";
import { RecentIssues, RecentIssuesSkeleton } from "./RecentIssues";
import { useDashboardData } from "./useDashboardData";
import { Card } from "./ui";
import { latestDeployment, totalPipelineTime } from "./data";
import { EmptyState } from "../../shared/ui/EmptyState";
import { AlertTriangle } from "lucide-react";

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="error-state">
      <AlertTriangle size={20} />
      <span>Unable to load deployment data — Something went wrong while fetching the latest deployment information.</span>
      <button className="link-button" onClick={onRetry}>Try again</button>
    </div>
  );
}

export function Dashboard({
  onOpenDeployment,
  onOpenIssue,
  onViewAllDeployments,
  onNewDeployment,
  onViewAnalysis
}: {
  onOpenDeployment: (id: string) => void;
  onOpenIssue: (id: string) => void;
  onViewAllDeployments: () => void;
  onNewDeployment: () => void;
  onViewAnalysis: () => void;
}) {
  const [range, setRange] = useState<RangeValue>("7d");
  const { state, data, reload } = useDashboardData(range);

  const headerAction = (
    <>
      <RangeSelector value={range} onChange={setRange} />
      <button className="primary-button" onClick={onNewDeployment}><Plus size={16} /> New Deployment</button>
    </>
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Engineering Release Dashboard</h2>
          <p>Monitor your deployments, verify application health, and track issues — all in one place.</p>
        </div>
        <div className="page-actions">{headerAction}</div>
      </div>

      {state === "error" ? <DashboardError onRetry={reload} /> : null}

      {state === "loading" ? (
        <>
          <KpiRowSkeleton />
          <div className="dash-row">
            <div className="dash-main">
              <Card title="Deployment Pipeline">
                <div className="skeleton" style={{ width: "100%", height: 64 }} />
              </Card>
              <HealthTrendSkeleton />
              <RecentDeploymentsSkeleton />
            </div>
            <div className="dash-side">
              <LatestDeploymentSkeleton />
              <EnvironmentStatusSkeleton />
              <RecentIssuesSkeleton />
            </div>
          </div>
        </>
      ) : state === "ready" && data.deployments.length === 0 ? (
        <EmptyState
          title="No deployments yet"
          description="Once your first deployment is connected, deployment health and verification results will appear here."
          icon={<Rocket size={22} />}
          action={<button className="primary-button" onClick={onNewDeployment}>Connect Deployment</button>}
        />
      ) : (
        <>
          <KpiRow />
          <div className="dash-row">
            <div className="dash-main">
              <Card title="Deployment Pipeline" action={<span className="pipeline-summary"><span className="check-badge"><Check size={12} className="check-mark" /> Completed</span> · Total time: {totalPipelineTime}</span>}>
                <Pipeline pipeline={latestDeployment.pipeline} />
              </Card>
              <HealthTrendChart data={data.healthTrend} />
              <RecentDeployments deployments={data.deployments} onViewAll={onViewAllDeployments} onOpen={(d) => onOpenDeployment(d.id)} onAction={(d) => onOpenDeployment(d.id)} />
            </div>
            <div className="dash-side">
              <LatestDeployment deployment={latestDeployment} onViewAll={onViewAllDeployments} onOpen={() => onOpenDeployment(latestDeployment.id)} />
              <EnvironmentStatusList onSelect={() => undefined} />
              <RecentIssues issues={data.issues} onOpen={(i) => onOpenIssue(i.id)} />
            </div>
          </div>
          <AiInsight onViewAnalysis={onViewAnalysis} />
        </>
      )}
    </section>
  );
}