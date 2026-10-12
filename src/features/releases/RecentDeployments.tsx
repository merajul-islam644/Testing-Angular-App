import { MoreHorizontal } from "lucide-react";
import type { Deployment } from "./data";
import { DataTable } from "../../shared/ui/DataTable";
import type { Column } from "../../shared/ui/DataTable";
import { Card, CardAction, EnvironmentBadge, Mono } from "./ui";

function DeployStatus({ status }: { status: Deployment["status"] }) {
  return <span className={`deploy-status ${status}`}>{status}</span>;
}

export function RecentDeployments({
  deployments,
  onViewAll,
  onOpen,
  onAction
}: {
  deployments: Deployment[];
  onViewAll: () => void;
  onOpen: (deployment: Deployment) => void;
  onAction: (deployment: Deployment) => void;
}) {
  const columns: Column<Deployment>[] = [
    { key: "version", header: "Version", render: (row) => <Mono>{row.version}</Mono> },
    { key: "environment", header: "Environment", render: (row) => <EnvironmentBadge environment={row.environment} /> },
    { key: "branch", header: "Branch", render: (row) => <span className="table-muted">{row.branch}</span> },
    { key: "deployedBy", header: "Deployed By", render: (row) => <span>{row.deployedBy}</span> },
    { key: "time", header: "Time", render: (row) => <span className="table-muted">{row.deployedAt}</span> },
    { key: "status", header: "Status", render: (row) => <DeployStatus status={row.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="row-actions">
          <button className="icon-button table-action" aria-label={`Actions for ${row.version}`} onClick={() => onAction(row)}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Card title="Recent Deployments" action={<CardAction onClick={onViewAll}>View all →</CardAction>}>
      <div className="deployments-table" onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest(".table-action")) return;
        const row = target.closest("tr");
        if (row) {
          const index = Array.from(row.parentElement?.children ?? []).indexOf(row);
          const deployment = deployments[index];
          if (deployment) onOpen(deployment);
        }
      }}>
        <DataTable columns={columns} rows={deployments} />
      </div>
    </Card>
  );
}

export function RecentDeploymentsSkeleton() {
  return (
    <Card title="Recent Deployments">
      <div className="deployments-table">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="deploy-row-skeleton">
            <div className="skeleton skeleton-line" style={{ width: 60 }} />
            <div className="skeleton skeleton-line" style={{ width: 90 }} />
            <div className="skeleton skeleton-line" style={{ width: 90 }} />
            <div className="skeleton skeleton-line" style={{ width: 110 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}