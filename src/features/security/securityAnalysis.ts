import type { VaultItem } from "../vault/vaultStore";
import { passwordStrength } from "../../lib/passwordStrength";

export type Finding = {
  id: string;
  kind: "Weak" | "Reused" | "Old" | "Compromised";
  itemIds: string[];
  label: string;
};

// Mocked breach data (SD-03): account emails/passwords known to have leaked.
export const MOCKED_BREACHES: { account: string; detail: string; severity: "Critical" | "Warning" }[] = [
  { account: "merajul@example.com", detail: "Appeared in a 2023 data breach (mock)", severity: "Critical" },
  { account: "merajul@work.com", detail: "Password reused across breached service (mock)", severity: "Warning" },
  { account: "merajul@gmail.com", detail: "Email found in a credential dump (mock)", severity: "Critical" },
  { account: "merajul@outlook.com", detail: "Listed in a public breach dataset (mock)", severity: "Warning" },
  { account: "merajul@icloud.com", detail: "No known breaches detected (mock)", severity: "Warning" }
];

const OLD_MS = 180 * 24 * 60 * 60 * 1000;

function classifyPassword(password: string): string {
  const strength = passwordStrength(password);
  if (strength.score <= 2) return "Weak";
  return "Good";
}

export function analyzeSecurity(items: VaultItem[]): {
  score: number;
  label: string;
  weak: number;
  reused: number;
  old: number;
  compromised: number;
  findings: Finding[];
} {
  const active = items.filter((item) => !item.deleted && item.password);
  const countByPassword = new Map<string, string[]>();
  for (const item of active) {
    const list = countByPassword.get(item.password) ?? [];
    list.push(item.id);
    countByPassword.set(item.password, list);
  }

  const compromisedIds = new Set<string>();
  for (const breach of MOCKED_BREACHES) {
    const account = breach.account.split("@")[0] ?? "";
    const match = active.find((item) => item.username.toLowerCase().startsWith(account.toLowerCase()));
    if (match) compromisedIds.add(match.id);
  }

  const findings: Finding[] = [];
  let weak = 0;
  let reused = 0;
  let old = 0;

  for (const item of active) {
    if (classifyPassword(item.password) === "Weak") {
      weak += 1;
      findings.push({ id: `weak-${item.id}`, kind: "Weak", itemIds: [item.id], label: `"${item.name}" uses a weak password` });
    }
  }

  for (const [password, ids] of countByPassword.entries()) {
    if (ids.length > 1) {
      reused += ids.length;
      const names = ids.map((id) => active.find((item) => item.id === id)?.name ?? "item").join(", ");
      findings.push({ id: `reused-${password}`, kind: "Reused", itemIds: ids, label: `Password reused across ${names}` });
    }
  }

  for (const item of active) {
    if (Date.now() - item.lastModified > OLD_MS) {
      old += 1;
      findings.push({ id: `old-${item.id}`, kind: "Old", itemIds: [item.id], label: `"${item.name}" password is over 6 months old` });
    }
  }

  for (const id of compromisedIds) {
    const item = active.find((entry) => entry.id === id);
    if (item) findings.push({ id: `comp-${id}`, kind: "Compromised", itemIds: [id], label: `"${item.name}" password appeared in a breach` });
  }

  const compromised = compromisedIds.size;
  const totalIssues = weak + reused + old + compromised;
  const score = Math.max(0, Math.min(100, 100 - totalIssues * 12));

  let label = "Strong";
  if (score < 40) label = "Weak";
  else if (score < 70) label = "Fair";
  else if (score < 85) label = "Good";

  return { score, label, weak, reused, old, compromised, findings };
}