export interface ParsedResponse {
  agentMessage: string;
  dataUpdate: Record<string, unknown>;
  substepUpdate: Record<string, boolean>;
  documentUpdate: { filename: string; content: string } | null;
  phaseComplete: boolean;
  nextPhase: number | null;
}

export function parseAgentResponse(fullText: string): ParsedResponse {
  // JSON 블록 추출 (응답 끝에 위치)
  const jsonMatch = fullText.match(/```json\s*\n([\s\S]*?)\n\s*```/);
  const agentMessage = fullText.replace(/```json\s*\n[\s\S]*?\n\s*```/g, "").trim();

  if (!jsonMatch) {
    return {
      agentMessage: fullText.trim(),
      dataUpdate: {},
      substepUpdate: {},
      documentUpdate: null,
      phaseComplete: false,
      nextPhase: null,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    return {
      agentMessage,
      dataUpdate: parsed.data_update || {},
      substepUpdate: parsed.substep_update || {},
      documentUpdate: parsed.document_update || null,
      phaseComplete: parsed.phase_complete || false,
      nextPhase: parsed.next_phase ?? null,
    };
  } catch {
    // JSON 파싱 실패 시 안전한 기본값 반환
    return {
      agentMessage: fullText.trim(),
      dataUpdate: {},
      substepUpdate: {},
      documentUpdate: null,
      phaseComplete: false,
      nextPhase: null,
    };
  }
}

/**
 * 사용자에게 보여줄 메시지에서 JSON 블록을 제거
 */
export function stripJsonBlock(text: string): string {
  return text.replace(/```json\s*\n[\s\S]*?\n\s*```/g, "").trim();
}
