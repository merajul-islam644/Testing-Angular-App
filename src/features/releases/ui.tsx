import type { ReactNode } from "react";
import { environmentAccent } from "./data";
import type { EnvironmentName } from "./data";

export function EnvironmentBadge({ environment }: { environment: EnvironmentName }) {
  return (
    <span className="env-badge">
      <span className="env-dot" style={{ background: environmentAccent[environment] }} />
      {environment}
    </span>
  );
}

export function Card({ title, action, children, className }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={["card", className].filter(Boolean).join(" ")}>
      <div className="card-head">
        <h3 className="card-title">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function CardAction({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <button className="card-action" onClick={onClick}>
      {children}
    </button>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="mono">{children}</span>;
}