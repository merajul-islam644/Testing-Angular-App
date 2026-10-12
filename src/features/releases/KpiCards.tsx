import type { ComponentType } from "react";
import { FlaskConical, Gauge, Heart, Link2, TriangleAlert } from "lucide-react";

type KpiTrend = { label: string; direction: "up" | "down" | "flat"; good: boolean };

type Kpi = {
  label: string;
  value: string;
  icon: ComponentType<{ size?: number | string }>;
  trend: KpiTrend;
  tone: "success" | "neutral";
};

const kpis: Kpi[] = [
  {
    label: "Production Health",
    value: "98%",
    icon: Heart,
    trend: { label: "↑ 2% vs last 7 days", direction: "up", good: true },
    tone: "success"
  },
  {
    label: "Tests Passed",
    value: "124/126",
    icon: FlaskConical,
    trend: { label: "↑ 3%", direction: "up", good: true },
    tone: "success"
  },
  {
    label: "Errors",
    value: "2",
    icon: TriangleAlert,
    trend: { label: "↓ 75%", direction: "down", good: true },
    tone: "neutral"
  },
  {
    label: "Broken Links",
    value: "0",
    icon: Link2,
    trend: { label: "no change", direction: "flat", good: true },
    tone: "neutral"
  },
  {
    label: "Performance",
    value: "1.4s",
    icon: Gauge,
    trend: { label: "↓ 28%", direction: "down", good: true },
    tone: "neutral"
  }
];

function TrendBadge({ trend }: { trend: KpiTrend }) {
  const dir = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "•";
  return <span className={trend.good ? "kpi-trend good" : "kpi-trend bad"}>{dir} {trend.label}</span>;
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{kpi.label}</span>
        <span className="kpi-icon">
          <kpi.icon size={16} />
        </span>
      </div>
      <div className="kpi-value">{kpi.value}</div>
      <TrendBadge trend={kpi.trend} />
    </div>
  );
}

export function KpiRow() {
  return (
    <div className="kpi-row">
      {kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
    </div>
  );
}

export function KpiRowSkeleton() {
  return (
    <div className="kpi-row">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi-card">
          <div className="kpi-top">
            <span className="skeleton skeleton-line" style={{ width: 100 }} />
          </div>
          <div className="skeleton" style={{ height: 30, width: 70 }} />
          <div className="skeleton skeleton-line" style={{ width: 90 }} />
        </div>
      ))}
    </div>
  );
}