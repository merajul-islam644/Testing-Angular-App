import { BadgeCheck, FileBarChart, FlaskConical, House, Rocket, Settings, TriangleAlert } from "lucide-react";

export const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/deployments", label: "Deployments", icon: Rocket },
  { href: "/verification", label: "Verification", icon: BadgeCheck },
  { href: "/issues", label: "Issues", icon: TriangleAlert },
  { href: "/test-runs", label: "Test Runs", icon: FlaskConical },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings }
] as const;

export type Environment = { name: string; color: string; health: string };

export const environments: Environment[] = [
  { name: "Production", color: "#22c55e", health: "98%" },
  { name: "Staging", color: "#3b82f6", health: "91%" },
  { name: "Development", color: "#6366f1", health: "84%" },
  { name: "UAT", color: "#f59e0b", health: "76%" },
  { name: "Custom", color: "#64748b", health: "62%" }
];