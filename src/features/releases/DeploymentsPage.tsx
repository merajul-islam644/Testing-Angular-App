import { MoreHorizontal } from "lucide-react";
import { deployments } from "./data";
import type { Deployment } from "./data";
import { DataTable } from "../../shared/ui/DataTable";
import type { Column } from "../../shared/ui/DataTable";
import { EnvironmentBadge, Mono } from "./ui";

function DeployStatus({ status }: { status: Deployment["status"] }) {
  return <span className={`deploy-status ${status}`}>{status}</span>;
}

export function DeploymentsPage({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const columns: Column<Deployment>[] = [
    { key: "version", header: "Version", render: (row) => <Mono>{row.version}</Mono> },
    { key: "environment", header: "Environment", render: (row) => <EnvironmentBadge environment={row.environment} /> },
    { key: "branch", header: "Branch", render: (row) => <span className="table-muted">{row.branch}</span> },
    { key: "deployedBy", header: "Deployed By", render: (row) => <span>{row.deployedBy}</span> },
    { key: "time", header: "Time", render: (row) => <span className="table-muted">{row.deployedAt}</span> },
    { key: "status", header: "Status", render: (row) => <DeployStatus status={row.status} /> }
  ];

  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>Deployments</h2>
          <p>All application releases across environments.</p>
        </div>
      </div>
      <div className="deployments-table" onClick={(event) => {
        const target = event.target as HTMLElement;
        const row = target.closest("tr");
        if (row) {
          const index = Array.from(row.parentElement?.children ?? []).indexOf(row);
          const deployment = deployments[index];
          if (deployment) onOpen(deployment.id);
        }
      }}>
        <DataTable columns={columns} rows={deployments} />
      </div>
    </section>
  );
}