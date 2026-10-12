import { passwordStrength } from "../../lib/passwordStrength";

export function StrengthMeter({ password, label }: { password: string; label: boolean }) {
  const strength = passwordStrength(password);
  const pct = strength.score === 0 ? 0 : strength.score * 20;
  return (
    <div className="strength-meter">
      <div className="strength-track">
        <span className={`strength-fill strength-${strength.tone}`} style={{ width: `${pct}%` }} />
      </div>
      {label ? <span className={`strength-label strength-${strength.tone}`}>{strength.label}</span> : null}
    </div>
  );
}