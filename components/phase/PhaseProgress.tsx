"use client";

import { cn } from "@/lib/utils";
import { PHASES } from "@/lib/constants/phases";
import { Check, Circle } from "lucide-react";

interface PhaseProgressProps {
  currentPhase: number;
  substeps: Record<string, boolean>;
}

export function PhaseProgress({ currentPhase, substeps }: PhaseProgressProps) {
  const phaseInfo = PHASES.find((p) => p.number === currentPhase);
  if (!phaseInfo) return null;

  const completedCount = Object.values(substeps).filter(Boolean).length;
  const totalCount = phaseInfo.substeps.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium text-sm">
          Phase {phaseInfo.number}: {phaseInfo.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {phaseInfo.description}
        </p>
      </div>

      {/* 진행률 바 */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>진행률</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 서브스텝 체크리스트 */}
      <div className="space-y-2">
        {phaseInfo.substeps.map((step) => {
          const isDone = substeps[step.key] === true;
          return (
            <div
              key={step.key}
              className={cn(
                "flex items-center gap-2 text-xs py-1",
                isDone ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
