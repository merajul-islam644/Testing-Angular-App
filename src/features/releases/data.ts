export type EnvironmentName = "Production" | "Staging" | "Development" | "UAT" | "Custom";

export type DeploymentStatus = "healthy" | "degraded" | "failed" | "deploying";

export type StageName = "Build" | "Test" | "Security Scan" | "Deploy" | "Verify";
export type StageStatus = "passed" | "failed" | "running" | "pending";

export type PipelineStage = {
  name: StageName;
  status: StageStatus;
  duration: string;
};

export type VerificationCheck = {
  name: string;
  passed: boolean;
  value: string;
  evidence?: { label: string; detail: string };
};

export type Deployment = {
  id: string;
  version: string;
  environment: EnvironmentName;
  branch: string;
  commit: string;
  deployedBy: string;
  deployedAt: string;
  status: DeploymentStatus;
  pipeline: PipelineStage[];
  verification: VerificationCheck[];
};

export type EnvironmentStatus = {
  name: EnvironmentName;
  status: "healthy" | "degraded" | "failed" | "deploying" | "unknown";
  healthScore: number;
  color: string;
};

export type IssueSeverity = "high" | "medium" | "low";
export type IssueKind = "console error" | "broken link" | "slow response" | "navigation failure";

export type Issue = {
  id: string;
  title: string;
  environment: EnvironmentName;
  time: string;
  severity: IssueSeverity;
  kind: IssueKind;
  detail: string;
};

export type HealthMetric = {
  date: string;
  healthScore: number;
  errors: number;
  averageResponseTime: number;
  testsPassed: number;
  testsTotal: number;
};

export const environmentAccent: Record<EnvironmentName, string> = {
  Production: "#22c55e",
  Staging: "#3b82f6",
  Development: "#6366f1",
  UAT: "#f59e0b",
  Custom: "#64748b"
};

export const pipelineStageOrder: StageName[] = ["Build", "Test", "Security Scan", "Deploy", "Verify"];

export const environments: EnvironmentStatus[] = [
  { name: "Production", status: "healthy", healthScore: 98, color: "#22c55e" },
  { name: "Staging", status: "degraded", healthScore: 91, color: "#3b82f6" },
  { name: "Development", status: "deploying", healthScore: 84, color: "#6366f1" },
  { name: "UAT", status: "failed", healthScore: 62, color: "#f59e0b" },
  { name: "Custom", status: "unknown", healthScore: 45, color: "#64748b" }
];

export const deployments: Deployment[] = [
  {
    id: "dep-01",
    version: "v2.8.1",
    environment: "Production",
    branch: "main",
    commit: "a1b2c3d",
    deployedBy: "Md Merajul Islam",
    deployedAt: "Sep 29, 2026 · 13:02",
    status: "healthy",
    pipeline: [
      { name: "Build", status: "passed", duration: "4m 12s" },
      { name: "Test", status: "passed", duration: "3m 40s" },
      { name: "Security Scan", status: "passed", duration: "2m 51s" },
      { name: "Deploy", status: "passed", duration: "2m 18s" },
      { name: "Verify", status: "passed", duration: "3m 17s" }
    ],
    verification: [
      { name: "Application Load", passed: true, value: "1.2s" },
      { name: "Console Errors", passed: true, value: "0" },
      { name: "Network Requests", passed: true, value: "42/42" },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  },
  {
    id: "dep-02",
    version: "v2.8.0",
    environment: "Production",
    branch: "main",
    commit: "9f3e7a1",
    deployedBy: "Fatima Rahman",
    deployedAt: "Sep 28, 2026 · 16:40",
    status: "healthy",
    pipeline: [
      { name: "Build", status: "passed", duration: "4m 05s" },
      { name: "Test", status: "passed", duration: "3m 22s" },
      { name: "Security Scan", status: "passed", duration: "2m 48s" },
      { name: "Deploy", status: "passed", duration: "2m 09s" },
      { name: "Verify", status: "passed", duration: "3m 05s" }
    ],
    verification: [
      { name: "Application Load", passed: true, value: "1.4s" },
      { name: "Console Errors", passed: true, value: "0" },
      { name: "Network Requests", passed: true, value: "41/42" },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  },
  {
    id: "dep-03",
    version: "v2.7.9",
    environment: "Staging",
    branch: "release/2.7",
    commit: "c4d5e6f",
    deployedBy: "James Okafor",
    deployedAt: "Sep 27, 2026 · 10:15",
    status: "degraded",
    pipeline: [
      { name: "Build", status: "passed", duration: "4m 18s" },
      { name: "Test", status: "passed", duration: "3m 34s" },
      { name: "Security Scan", status: "failed", duration: "1m 02s" },
      { name: "Deploy", status: "pending", duration: "" },
      { name: "Verify", status: "pending", duration: "" }
    ],
    verification: [
      { name: "Application Load", passed: true, value: "1.9s" },
      { name: "Console Errors", passed: true, value: "0" },
      { name: "Network Requests", passed: true, value: "40/42" },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  },
  {
    id: "dep-04",
    version: "v2.7.8",
    environment: "Development",
    branch: "feature/payments",
    commit: "2b8c9d0",
    deployedBy: "Priya Nair",
    deployedAt: "Sep 26, 2026 · 09:05",
    status: "failed",
    pipeline: [
      { name: "Build", status: "passed", duration: "4m 22s" },
      { name: "Test", status: "failed", duration: "0m 58s" },
      { name: "Security Scan", status: "pending", duration: "" },
      { name: "Deploy", status: "pending", duration: "" },
      { name: "Verify", status: "pending", duration: "" }
    ],
    verification: [
      { name: "Application Load", passed: false, value: "4.7s", evidence: { label: "Logs", detail: "Slow first paint observed on the payments route — see network trace." } },
      { name: "Console Errors", passed: false, value: "3", evidence: { label: "Console", detail: "Uncaught TypeError in checkout bundle (checkout.ts:112)." } },
      { name: "Network Requests", passed: false, value: "31/42", evidence: { label: "Network", detail: "11 requests failed with 500 from the billing service." } },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  },
  {
    id: "dep-05",
    version: "v2.7.7",
    environment: "UAT",
    branch: "release/2.7",
    commit: "e5f6a7b",
    deployedBy: "Daniel Kim",
    deployedAt: "Sep 25, 2026 · 14:30",
    status: "healthy",
    pipeline: [
      { name: "Build", status: "passed", duration: "3m 58s" },
      { name: "Test", status: "passed", duration: "3m 12s" },
      { name: "Security Scan", status: "passed", duration: "2m 40s" },
      { name: "Deploy", status: "passed", duration: "2m 03s" },
      { name: "Verify", status: "passed", duration: "2m 58s" }
    ],
    verification: [
      { name: "Application Load", passed: true, value: "1.1s" },
      { name: "Console Errors", passed: true, value: "0" },
      { name: "Network Requests", passed: true, value: "42/42" },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  },
  {
    id: "dep-06",
    version: "v2.7.6",
    environment: "Production",
    branch: "main",
    commit: "7a8b9c0",
    deployedBy: "Fatima Rahman",
    deployedAt: "Sep 24, 2026 · 11:55",
    status: "healthy",
    pipeline: [
      { name: "Build", status: "passed", duration: "4m 10s" },
      { name: "Test", status: "passed", duration: "3m 28s" },
      { name: "Security Scan", status: "passed", duration: "2m 46s" },
      { name: "Deploy", status: "passed", duration: "2m 11s" },
      { name: "Verify", status: "passed", duration: "3m 09s" }
    ],
    verification: [
      { name: "Application Load", passed: true, value: "1.3s" },
      { name: "Console Errors", passed: true, value: "0" },
      { name: "Network Requests", passed: true, value: "42/42" },
      { name: "Navigation", passed: true, value: "8/8" },
      { name: "Broken Links", passed: true, value: "0" }
    ]
  }
];

export const latestDeployment: Deployment = deployments[0]!;

export const healthTrend: HealthMetric[] = [
  { date: "Sep 23", healthScore: 94, errors: 5, averageResponseTime: 1.9, testsPassed: 121, testsTotal: 126 },
  { date: "Sep 24", healthScore: 95, errors: 4, averageResponseTime: 1.8, testsPassed: 122, testsTotal: 126 },
  { date: "Sep 25", healthScore: 96, errors: 3, averageResponseTime: 1.7, testsPassed: 123, testsTotal: 126 },
  { date: "Sep 26", healthScore: 95, errors: 4, averageResponseTime: 1.6, testsPassed: 122, testsTotal: 126 },
  { date: "Sep 27", healthScore: 97, errors: 2, averageResponseTime: 1.5, testsPassed: 124, testsTotal: 126 },
  { date: "Sep 28", healthScore: 98, errors: 1, averageResponseTime: 1.4, testsPassed: 124, testsTotal: 126 },
  { date: "Sep 29", healthScore: 98, errors: 2, averageResponseTime: 1.4, testsPassed: 124, testsTotal: 126 }
];

export const issues: Issue[] = [
  { id: "iss-01", title: "Billing page loads slowly", environment: "Production", time: "Sep 29, 2026 · 12:18", severity: "high", kind: "slow response", detail: "The billing overview endpoint averages 4.7s response time under normal load, well above the 2s SLO. Traces point to an unindexed query on the invoices table." },
  { id: "iss-02", title: "Console error on checkout", environment: "Development", time: "Sep 29, 2026 · 09:41", severity: "medium", kind: "console error", detail: "Uncaught TypeError thrown in the checkout bundle when a promo code field is cleared. No user impact in production yet." },
  { id: "iss-03", title: "Broken link in help docs", environment: "Staging", time: "Sep 28, 2026 · 17:02", severity: "low", kind: "broken link", detail: "The 'Reset password' link in the help centre resolves to a 404 after the last content migration." },
  { id: "iss-04", title: "Navigation fails on analytics", environment: "UAT", time: "Sep 28, 2026 · 10:26", severity: "medium", kind: "navigation failure", detail: "Client-side routing to /analytics intermittently fails on UAT, showing a blank frame until refresh." }
];

export const latestIssues = issues;

export function getDeployment(id: string): Deployment | undefined {
  return deployments.find((deployment) => deployment.id === id);
}

export const totalPipelineTime = "16m 18s";