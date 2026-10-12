import { Check, CircleX, Loader2, Minus } from "lucide-react";
import { pipelineStageOrder } from "./data";
import type { PipelineStage, StageStatus } from "./data";

function StageIcon({ status }: { status: StageStatus }) {
  if (status === "passed") return <Check size={15} />;
  if (status === "failed") return <CircleX size={15} />;
  if (status === "running") return <Loader2 size={15} className="spin" />;
  return <Minus size={15} />;
}

function stageClass(status: StageStatus): string {
  if (status === "passed") return "passed";
  if (status === "failed") return "failed";
  if (status === "running") return "running";
  return "pending";
}

export function Pipeline({ pipeline }: { pipeline: PipelineStage[] }) {
  const ordered = pipelineStageOrder.map(
    (name) => pipeline.find((stage) => stage.name === name) ?? { name, status: "pending" as StageStatus, duration: "" }
  );

  return (
    <div className="pipeline">
      {ordered.map((stage, index) => (
        <div key={stage.name} className="pipeline-stage-wrap">
          {index > 0 ? <div className="pipeline-connector" /> : null}
          <div className={`pipeline-stage ${stageClass(stage.status)}`}>
            <span className="pipeline-icon"><StageIcon status={stage.status} /></span>
            <span className="pipeline-name">{stage.name}</span>
            <span className="pipeline-duration">{stage.duration || "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}