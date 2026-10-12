import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HealthMetric } from "./data";
import { Card } from "./ui";

export function HealthTrendChart({ data }: { data: HealthMetric[] }) {
  const latest = data[data.length - 1];
  return (
    <Card title="Application Health Trend">
      <div className="health-trend">
        <div className="health-chart">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "hsl(var(--foreground))"
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="healthScore" name="Health Score" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="averageResponseTime" name="Resp. Time (s)" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="health-panel">
          <div className="health-panel-label">Current Health Score</div>
          <div className="health-panel-value">{latest?.healthScore ?? 98}/100 <span className="health-up">↑ 2%</span></div>
          <div className="health-bar">
            <div className="health-bar-fill" style={{ width: `${latest?.healthScore ?? 98}%` }} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HealthTrendSkeleton() {
  return (
    <Card title="Application Health Trend">
      <div className="health-trend">
        <div className="health-chart">
          <div className="skeleton" style={{ width: "100%", height: 260 }} />
        </div>
        <div className="health-panel">
          <div className="skeleton skeleton-line" style={{ width: 120 }} />
          <div className="skeleton" style={{ height: 32, width: 130 }} />
          <div className="skeleton" style={{ width: "100%", height: 8, borderRadius: 999 }} />
        </div>
      </div>
    </Card>
  );
}