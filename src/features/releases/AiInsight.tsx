import { Sparkles } from "lucide-react";

export function AiInsight({ onViewAnalysis }: { onViewAnalysis: () => void }) {
  return (
    <div className="ai-insight">
      <div className="ai-insight-head">
        <Sparkles size={15} />
        <span>AI Insight</span>
      </div>
      <p className="ai-insight-text">
        Production health improved 4% this week, no new console errors, and response time fell from 1.9s to 1.4s.
      </p>
      <button className="link-button ai-insight-link" onClick={onViewAnalysis}>View analysis →</button>
    </div>
  );
}