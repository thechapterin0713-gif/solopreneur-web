import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/prompts";
import { parseAgentResponse } from "@/lib/ai/parse-response";
import { applyUpdates } from "@/lib/ai/session-manager";
import type { Project } from "@/lib/types/session";

export async function POST(req: Request) {
  const { messages, projectId } = await req.json();
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 프로젝트 로드
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return new Response("Project not found", { status: 404 });
  }

  const typedProject = project as Project;

  // 현재 Phase의 기존 산출물 로드
  const { data: currentDoc } = await supabase
    .from("output_documents")
    .select("content")
    .eq("project_id", projectId)
    .eq("phase", typedProject.current_phase)
    .single();

  // 이전 Phase 산출물 로드
  const { data: previousDocs } = await supabase
    .from("output_documents")
    .select("filename, content")
    .eq("project_id", projectId)
    .lt("phase", typedProject.current_phase);

  const previousOutputs: Record<string, string> = {};
  if (previousDocs) {
    for (const doc of previousDocs) {
      previousOutputs[doc.filename] = doc.content;
    }
  }

  // 새 프로젝트 여부 (메시지가 없거나 첫 메시지인 경우)
  const isNewProject = messages.length <= 1;

  // 시스템 프롬프트 빌드
  const systemPrompt = buildSystemPrompt(
    typedProject.current_phase,
    typedProject.session_data,
    typedProject.current_phase_substeps,
    currentDoc?.content || null,
    previousOutputs,
    isNewProject
  );

  // Claude 스트리밍 호출
  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 4096,
    onFinish: async ({ text }) => {
      // 응답 파싱 및 DB 업데이트
      const parsed = parseAgentResponse(text);

      // DB에 업데이트 적용
      await applyUpdates(supabase, projectId, typedProject, parsed);

      // 어시스턴트 메시지 저장
      await supabase.from("messages").insert({
        project_id: projectId,
        role: "assistant",
        content: parsed.agentMessage,
        phase: typedProject.current_phase,
        metadata: {
          data_update: parsed.dataUpdate,
          substep_update: parsed.substepUpdate,
          phase_complete: parsed.phaseComplete,
        },
      });

      // 사용자 메시지 저장 (마지막 메시지가 user인 경우)
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "user") {
        await supabase.from("messages").insert({
          project_id: projectId,
          role: "user",
          content: lastMsg.content,
          phase: typedProject.current_phase,
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
