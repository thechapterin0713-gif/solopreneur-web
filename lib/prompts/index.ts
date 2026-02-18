import type { SessionData } from "@/lib/types/session";
import { getBaseSystemPrompt } from "./base-system";
import { getPhase0Prompt } from "./phase0";
import { getPhase1Prompt } from "./phase1";
import { getPhase2Prompt } from "./phase2";
import { getPhase3Prompt } from "./phase3";
import { getPhase4Prompt } from "./phase4";
import { getPhase5Prompt } from "./phase5";
import { getPhase6Prompt } from "./phase6";
import { getPhase7Prompt } from "./phase7";

export function buildSystemPrompt(
  phase: number,
  sessionData: SessionData,
  substeps: Record<string, boolean>,
  existingDocument: string | null,
  previousOutputs: Record<string, string>,
  isNewProject: boolean = false
): string {
  const base = getBaseSystemPrompt();

  let phasePrompt: string;
  switch (phase) {
    case 0:
      phasePrompt = getPhase0Prompt(sessionData, isNewProject);
      break;
    case 1:
      phasePrompt = getPhase1Prompt(sessionData, substeps, existingDocument);
      break;
    case 2:
      phasePrompt = getPhase2Prompt(sessionData, substeps, existingDocument);
      break;
    case 3:
      phasePrompt = getPhase3Prompt(sessionData, substeps, existingDocument);
      break;
    case 4:
      phasePrompt = getPhase4Prompt(sessionData, substeps, existingDocument);
      break;
    case 5:
      phasePrompt = getPhase5Prompt(sessionData, substeps, existingDocument);
      break;
    case 6:
      phasePrompt = getPhase6Prompt(sessionData, substeps, existingDocument);
      break;
    case 7:
      phasePrompt = getPhase7Prompt(sessionData, substeps, existingDocument);
      break;
    default:
      phasePrompt = "";
  }

  // 이전 Phase 산출물 컨텍스트
  const prevContext = buildPreviousContext(phase, previousOutputs);

  return `${base}\n\n${phasePrompt}${prevContext ? `\n\n${prevContext}` : ""}`;
}

function buildPreviousContext(
  currentPhase: number,
  previousOutputs: Record<string, string>
): string {
  if (currentPhase <= 1 || Object.keys(previousOutputs).length === 0) {
    return "";
  }

  const relevantOutputs = Object.entries(previousOutputs)
    .filter(([, content]) => content && content.length > 0)
    .map(([filename, content]) => `### ${filename}\n${content}`)
    .join("\n\n");

  if (!relevantOutputs) return "";

  return `## 이전 Phase 산출물 (참조용)
다음은 이전 Phase에서 수집된 산출물입니다. 현재 Phase에서 참조하되, 이미 수집된 정보를 반복 질문하지 마세요.

${relevantOutputs}`;
}
