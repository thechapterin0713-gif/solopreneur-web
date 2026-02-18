"use client";

import { cn } from "@/lib/utils";
import { PHASES } from "@/lib/constants/phases";
import { Check } from "lucide-react";

interface PhaseNavBarProps {
  currentPhase: number;
  completedPhases: number[];
}

export function PhaseNavBar({ currentPhase, completedPhases }: PhaseNavBarProps) {
  return (
    <div className="flex items-center gap-1 p-3 border-b overflow-x-auto">
      {PHASES.map((phase) => {
        const isCompleted = completedPhases.includes(phase.number);
        const isCurrent = currentPhase === phase.number;

        return (
          <div
            key={phase.number}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors",
              isCompleted && "bg-green-100 text-green-800",
              isCurrent && !isCompleted && "bg-blue-100 text-blue-800 font-medium",
              !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <Check className="h-3 w-3" />
            ) : (
              <span className="font-medium">{phase.number}</span>
            )}
            <span>{phase.name}</span>
          </div>
        );
      })}
    </div>
  );
}
