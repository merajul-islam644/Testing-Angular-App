export type Strength = { score: number; label: string; tone: "weak" | "fair" | "good" | "strong" };

export function passwordStrength(password: string): Strength {
  if (!password) return { score: 0, label: "Very weak", tone: "weak" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score >= 5) return { score: 5, label: "Strong", tone: "strong" };
  if (score === 4) return { score: 4, label: "Good", tone: "good" };
  if (score === 3) return { score: 3, label: "Fair", tone: "fair" };
  return { score: score > 0 ? 1 : 0, label: "Weak", tone: "weak" };
}