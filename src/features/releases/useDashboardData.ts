import { useEffect, useState } from "react";
import { deployments, healthTrend, issues } from "./data";
import type { Deployment, HealthMetric, Issue } from "./data";
import type { RangeValue } from "./RangeSelector";

export type DashboardLoadState = "loading" | "ready" | "error";

export type DashboardData = {
  deployments: Deployment[];
  healthTrend: HealthMetric[];
  issues: Issue[];
};

const data: DashboardData = { deployments, healthTrend, issues };

export function useDashboardData(range: RangeValue): { state: DashboardLoadState; data: DashboardData; reload: () => void } {
  const [state, setState] = useState<DashboardLoadState>("loading");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setState("loading");
    const timer = setTimeout(() => setState("ready"), 450);
    return () => clearTimeout(timer);
  }, [range, tick]);

  const window = range === "24h" ? 1 : range === "7d" ? 7 : range === "30d" ? 14 : range === "90d" ? 21 : 7;

  return {
    state,
    reload: () => setTick((value) => value + 1),
    data: {
      deployments,
      healthTrend: window >= 7 ? healthTrend : healthTrend.slice(-window),
      issues
    }
  };
}