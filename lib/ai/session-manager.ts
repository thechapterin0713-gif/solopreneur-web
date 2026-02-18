import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedResponse } from "./parse-response";
import type { Project } from "@/lib/types/session";
import { PHASES } from "@/lib/constants/phases";

/**
 * Claude 응답에서 파싱된 데이터를 DB에 적용
 */
export async function applyUpdates(
  supabase: SupabaseClient,
  projectId: string,
  project: Project,
  parsed: ParsedResponse
) {
  // 1. session_data 딥 머지
  const updatedData = deepMerge(
    project.session_data as unknown as Record<string, unknown>,
    parsed.dataUpdate
  );

  // 2. substep 업데이트
  const updatedSubsteps = {
    ...project.current_phase_substeps,
    ...parsed.substepUpdate,
  };

  // 3. 프로젝트 업데이트 빌드
  const projectUpdate: Record<string, unknown> = {
    session_data: updatedData,
    current_phase_substeps: updatedSubsteps,
    updated_at: new Date().toISOString(),
  };

  // 4. Phase 완료 처리
  if (parsed.phaseComplete) {
    const completedPhases = [...project.completed_phases];
    if (!completedPhases.includes(project.current_phase)) {
      completedPhases.push(project.current_phase);
    }
    projectUpdate.completed_phases = completedPhases;

    // 산출물 상태 업데이트
    const outputs = { ...project.outputs };
    const phaseInfo = PHASES.find((p) => p.number === project.current_phase);
    if (phaseInfo?.outputFile) {
      outputs[phaseInfo.outputFile] = true;
    }
    projectUpdate.outputs = outputs;

    if (parsed.nextPhase !== null) {
      projectUpdate.current_phase = parsed.nextPhase;
      projectUpdate.current_phase_substeps = {};
    }
  }

  await supabase.from("projects").update(projectUpdate).eq("id", projectId);

  // 5. 산출물 문서 업데이트
  if (parsed.documentUpdate) {
    await upsertDocument(supabase, projectId, project.current_phase, parsed.documentUpdate);
  }
}

async function upsertDocument(
  supabase: SupabaseClient,
  projectId: string,
  phase: number,
  update: { filename: string; content: string }
) {
  const { data: existing } = await supabase
    .from("output_documents")
    .select("id")
    .eq("project_id", projectId)
    .eq("filename", update.filename)
    .single();

  if (existing) {
    await supabase
      .from("output_documents")
      .update({
        content: update.content,
        status: "in_progress",
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("output_documents").insert({
      project_id: projectId,
      filename: update.filename,
      content: update.content,
      phase,
      status: "in_progress",
    });
  }
}

/**
 * 깊은 병합 — 중첩 객체는 재귀적으로, 배열은 교체
 */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      );
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}
